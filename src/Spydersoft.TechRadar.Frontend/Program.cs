using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.IdentityModel.Logging;
using Spydersoft.Core.Hosting;
using Spydersoft.TechRadar.Frontend.Configuration;


var builder = WebApplication.CreateBuilder(args);

builder.AddSpydersoftTelemetry(typeof(Program).Assembly);
builder.AddSpydersoftSerilog();

builder.Services.AddProxy(builder.Configuration);
builder.Services.AddHealthChecks();
builder.Services.AddAuthentication(builder.Configuration);
builder.Services.AddAuthorization(options =>
{
    // This is a default authorization policy which requires authentication
    options.AddPolicy("RequireAuthenticatedUserPolicy", policy =>
    {
        policy.RequireAuthenticatedUser();
    });
});

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                      });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseSwagger();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwaggerUI();
    IdentityModelEventSource.ShowPII = true;
    IdentityModelEventSource.LogCompleteSecurityArtifact = true;
}

app.UseCustomForwardedHeaders();
app.UseHealthChecks("/healthz", new HealthCheckOptions { Predicate = check => check.Tags.Contains("ready") })
    .UseAuthentication()
    .UseAuthorization()
    .UseCors(MyAllowSpecificOrigins);


app.MapControllers();
app.MapReverseProxy();
app.MapFallbackToFile("/index.html");

await app.RunAsync();
