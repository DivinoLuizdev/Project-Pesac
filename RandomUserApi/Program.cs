using Microsoft.EntityFrameworkCore;
using RandomUserApi.Data;
using RandomUserApi.Services;
using Serilog;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Carrega configurações do appsettings.json, ambiente, etc
var configuration = builder.Configuration;

// Garante que a pasta Logs exista
Directory.CreateDirectory("Logs");

// Define o nome do arquivo de log com data e hora no nome
var logFileName = $"Logs/log-{DateTime.Now:yyyyMMddHHmmss}.txt";

// Configura Serilog com base no appsettings.json + console + arquivo
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File(logFileName)
    .CreateLogger();

builder.Host.UseSerilog();

// Pega a connection string do appsettings.json (chave "DefaultConnection")
var connectionString = configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// Registra o RandomUserService com HttpClient
builder.Services.AddHttpClient<RandomUserService>();

// Configura CORS
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("http://127.0.0.1:5500", "http://localhost:5500", "http://localhost:5000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Adiciona controllers
builder.Services.AddControllers();

// Adiciona suporte a Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Middleware para usar Swagger e Swagger UI (http://localhost:5000/swagger/index.html)
app.UseSwagger();
app.UseSwaggerUI();

// Usa CORS
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

// Aplica migrations automaticamente ao iniciar a aplicação
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
}

app.Run();
