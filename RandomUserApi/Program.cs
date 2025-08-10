using Microsoft.EntityFrameworkCore;
using RandomUserApi.Data;
using RandomUserApi.Services;
using Serilog;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Garante que a pasta Logs exista
Directory.CreateDirectory("Logs");

// Define o nome do arquivo de log com data e hora no nome
var logFileName = $"Logs/log-{DateTime.Now:yyyyMMddHHmmss}.txt";

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)  
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File(logFileName)   
    .CreateLogger();

// Usa o Serilog no host
builder.Host.UseSerilog();

// Configuração do DbContext (PostgreSQL)

var connectionString = "Host=usuarios-postgres;Port=5432;Database=usuariosdb;Username=admin;Password=admin123";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// Registra o RandomUserService com HttpClient
builder.Services.AddHttpClient<RandomUserService>();

// ### Adicione o CORS aqui ###
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy  =>
        {
            policy.WithOrigins("http://127.0.0.1:5500", "http://localhost:5500", "http://localhost:5000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Adiciona controllers
builder.Services.AddControllers();

// Adiciona suporte a Swagger (padrão)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Middleware para usar Swagger e Swagger UI (http://localhost:5062/swagger/index.html)
app.UseSwagger();
app.UseSwaggerUI();

// ### Adicione o middleware de CORS antes do UseAuthorization ###
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();
