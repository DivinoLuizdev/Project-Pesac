using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RandomUserApi.Data;
using RandomUserApi.Models;
using RandomUserApi.Services;
using System;
using System.Threading.Tasks;
using System.Text;
using Microsoft.AspNetCore.Http;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System.IO;
using System.Collections.Generic;
using System.Linq;  

namespace RandomUserApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly RandomUserService _randomUserService;
        private readonly ILogger<UsersController> _logger;

        public UsersController(ApplicationDbContext context, RandomUserService randomUserService, ILogger<UsersController> logger)
        {
            _context = context;
            _randomUserService = randomUserService;
            _logger = logger;
            QuestPDF.Settings.License = LicenseType.Community;
        }

        // ------------------------------------
        // Seção de Leitura (GET)
        // ------------------------------------

        /// <summary>
        /// Obtém uma lista paginada de todos os usuários.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll(int pageNumber = 1, int pageSize = 10)
        {
            _logger.LogInformation("Requisição GET api/users iniciada. Página {PageNumber}, Tamanho {PageSize}", pageNumber, pageSize);

            if (pageNumber <= 0) pageNumber = 1;
            if (pageSize <= 0) pageSize = 10;

            var totalUsers = await _context.Users.CountAsync();
            var totalPages = (int)Math.Ceiling(totalUsers / (double)pageSize);

            var users = await _context.Users
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var response = new
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = totalPages,
                TotalUsers = totalUsers,
                Users = users
            };

            _logger.LogInformation("Retornando {Count} usuários da página {PageNumber} de {TotalPages}.", users.Count, pageNumber, totalPages);
            return Ok(response);
        }

        /// <summary>
        /// Obtém um usuário específico pelo seu ID.
        /// </summary>
        [HttpGet("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(Guid id)
        {
            _logger.LogInformation("Requisição GET api/users/{Id} iniciada.", id);

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                _logger.LogWarning("Usuário com ID {Id} não encontrado.", id);
                return NotFound();
            }

            _logger.LogInformation("Usuário com ID {Id} encontrado.", id);
            return Ok(user);
        }
        
        // ------------------------------------
        // Seção de Criação (POST)
        // ------------------------------------

        /// <summary>
        /// Cria um novo usuário.
        /// </summary>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> Create(User user)
        {
            _logger.LogInformation("Requisição POST api/users iniciada.");

            user.Id = Guid.NewGuid();
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Usuário criado com ID {Id}.", user.Id);
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }

        /// <summary>
        /// Gera e salva um novo usuário aleatório.
        /// </summary>
        [HttpPost("generate")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> GenerateUser()
        {
            _logger.LogInformation("Requisição POST api/users/generate iniciada.");

            var user = await _randomUserService.GetRandomUserAsync();
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Usuário gerado e salvo com ID {Id}.", user.Id);
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }

        // ------------------------------------
        // Seção de Atualização (PUT)
        // ------------------------------------

        /// <summary>
        /// Atualiza um usuário existente pelo seu ID.
        /// </summary>
        [HttpPut("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(Guid id, User updatedUser)
        {
            _logger.LogInformation("Requisição PUT api/users/{Id} iniciada.", id);

            if (id != updatedUser.Id)
            {
                _logger.LogWarning("Falha na atualização: ID do usuário não confere. Id passado: {Id}, Id do usuário: {UserId}.", id, updatedUser.Id);
                return BadRequest("User ID mismatch.");
            }

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null)
            {
                _logger.LogWarning("Usuário com ID {Id} não encontrado para atualização.", id);
                return NotFound();
            }
            
            _context.Entry(existingUser).CurrentValues.SetValues(updatedUser);
            _context.Users.Update(existingUser);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Usuário com ID {Id} atualizado.", id);

            return NoContent();
        }

        // ------------------------------------
        // Seção de Exclusão (DELETE)
        // ------------------------------------

        /// <summary>
        /// Remove um usuário pelo seu ID.
        /// </summary>
        [HttpDelete("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(Guid id)
        {
            _logger.LogInformation("Requisição DELETE api/users/{Id} iniciada.", id);

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                _logger.LogWarning("Usuário com ID {Id} não encontrado para exclusão.", id);
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Usuário com ID {Id} removido.", id);

            return NoContent();
        }

        // ------------------------------------
        // Seção de Relatórios
        // ------------------------------------

        /// <summary>
        /// Gera um relatório de usuários em formato PDF.
        /// </summary>
        [HttpGet("relatorio-pdf")]
        [Produces("application/pdf")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetRelatorioPdf()
        {
            _logger.LogInformation("Requisição GET api/users/relatorio-pdf iniciada.");

            var usuarios = await _context.Users.ToListAsync();

            var pdfBytes = GeneratePdf(usuarios);

            _logger.LogInformation("Relatório PDF gerado com {Count} usuários.", usuarios.Count);

            return File(pdfBytes, "application/pdf", "relatorio_usuarios.pdf");
        }

        /// <summary>
        /// Gera um relatório de usuários em formato CSV.
        /// </summary>
        [HttpGet("relatorio-csv")]
        [Produces("text/csv")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetRelatorioCsv()
        {
            _logger.LogInformation("Requisição GET api/users/relatorio-csv iniciada.");

            var usuarios = await _context.Users.ToListAsync();

            var csv = new StringBuilder();
            csv.AppendLine("Id,Nome Completo,Email,Telefone,Cidade,Estado,País");

            foreach (var user in usuarios)
            {
                var nomeCompleto = $"{user.Title} {user.FirstName} {user.LastName}".Trim();
                var linha = $"{user.Id},{EscapeCsv(nomeCompleto)},{EscapeCsv(user.Email)},{EscapeCsv(user.Phone)},{EscapeCsv(user.City)},{EscapeCsv(user.State)},{EscapeCsv(user.Country)}";
                csv.AppendLine(linha);
            }

            var bytes = Encoding.UTF8.GetBytes(csv.ToString());

            _logger.LogInformation("Relatório CSV gerado com {Count} usuários.", usuarios.Count);

            return File(bytes, "text/csv", "relatorio_usuarios.csv");
        }

        // ------------------------------------
        // Métodos de Suporte (Privados)
        // ------------------------------------

        private byte[] GeneratePdf(List<User> usuarios)
        {
            // O código deste método permanece inalterado
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(20);
                    page.Size(PageSizes.A4);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(10).FontFamily("Helvetica"));
                    page.Header()
                        .Column(headerCol =>
                        {
                            headerCol.Item()
                                     .Text("Relatório de Usuários")
                                     .SemiBold()
                                     .FontSize(20)
                                     .FontColor(Colors.BlueGrey.Darken2)
                                     .AlignCenter();
                            headerCol.Item().PaddingTop(5).Text(DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"))
                                            .FontSize(10)
                                            .FontColor(Colors.Grey.Medium)
                                            .AlignRight();
                            headerCol.Item().PaddingTop(10).LineHorizontal(2).LineColor(Colors.BlueGrey.Lighten2);
                        });
                    page.Content()
                        .PaddingVertical(10)
                        .Column(contentCol =>
                        {
                            contentCol.Item().Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.RelativeColumn(4);
                                    columns.RelativeColumn(5);
                                    columns.RelativeColumn(3);
                                    columns.RelativeColumn(3);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(2);
                                });

                                table.Header(header =>
                                {
                                    header.Cell().Element(HeaderCellStyle).Text("Nome Completo");
                                    header.Cell().Element(HeaderCellStyle).Text("Email");
                                    header.Cell().Element(HeaderCellStyle).Text("Telefone");
                                    header.Cell().Element(HeaderCellStyle).Text("Cidade");
                                    header.Cell().Element(HeaderCellStyle).Text("Estado");
                                    header.Cell().Element(HeaderCellStyle).Text("País");
                                });

                                foreach (var (user, index) in usuarios.Select((user, index) => (user, index)))
                                {
                                    var nomeCompleto = $"{user.Title} {user.FirstName} {user.LastName}".Trim();
                                    table.Cell().Element(c => DataCellStyle(c, index)).Text(nomeCompleto);
                                    table.Cell().Element(c => DataCellStyle(c, index)).Text(user.Email);
                                    table.Cell().Element(c => DataCellStyle(c, index)).Text(user.Phone);
                                    table.Cell().Element(c => DataCellStyle(c, index)).Text(user.City);
                                    table.Cell().Element(c => DataCellStyle(c, index)).Text(user.State);
                                    table.Cell().Element(c => DataCellStyle(c, index)).Text(user.Country);
                                }
                            });
                        });
                    page.Footer()
                        .Column(footerCol =>
                        {
                            footerCol.Item().PaddingTop(10).LineHorizontal(1).LineColor(Colors.BlueGrey.Lighten2);
                            footerCol.Item()
                                     .Row(row =>
                                     {
                                         row.RelativeItem(1)
                                            .Text($"Gerado em {DateTime.Now:dd/MM/yyyy HH:mm:ss}")
                                            .FontSize(9)
                                            .FontColor(Colors.Grey.Medium);
                                         row.RelativeItem(1)
                                            .AlignCenter()
                                            .Text(text =>
                                            {
                                                text.Span("Página ").FontSize(9).FontColor(Colors.Grey.Medium);
                                                text.CurrentPageNumber().FontSize(9).FontColor(Colors.Grey.Medium);
                                                text.Span(" de ").FontSize(9).FontColor(Colors.Grey.Medium);
                                                text.TotalPages().FontSize(9).FontColor(Colors.Grey.Medium);
                                            });
                                     });
                        });
                });
            });

            using var stream = new MemoryStream();
            document.GeneratePdf(stream);
            return stream.ToArray();
        }

        private static IContainer HeaderCellStyle(IContainer container)
        {
            return container.DefaultTextStyle(x => x.SemiBold().FontColor(Colors.White))
                            .Background(Colors.BlueGrey.Darken2)
                            .PaddingVertical(10)
                            .PaddingHorizontal(8);
        }

        private static IContainer DataCellStyle(IContainer container, int index)
        {
            var backgroundColor = index % 2 == 0 ? Colors.Grey.Lighten4 : Colors.White;

            return container.Background(backgroundColor)
                            .BorderBottom(1).BorderColor(Colors.Grey.Lighten2)
                            .PaddingVertical(4)
                            .PaddingHorizontal(8);
        }

        private string EscapeCsv(string? campo)
        {
            if (string.IsNullOrEmpty(campo)) return "";

            if (campo.Contains(",") || campo.Contains("\"") || campo.Contains("\n"))
            {
                campo = campo.Replace("\"", "\"\"");
                return $"\"{campo}\"";
            }

            return campo;
        }
    }
}