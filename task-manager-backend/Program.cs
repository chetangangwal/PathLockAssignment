using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using System.Collections.Concurrent;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options => options.AddPolicy("AllowAll", policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
var app = builder.Build();
app.UseCors("AllowAll");

record TaskItem(int Id, string Description, bool IsCompleted);

var store = new ConcurrentDictionary<int,TaskItem>();
var idCounter = 0;

app.MapGet("/api/tasks", () => Results.Ok(store.Values.OrderBy(t=>t.Id)));

app.MapPost("/api/tasks", async (HttpRequest req) =>
{
    var dto = await req.ReadFromJsonAsync<Dictionary<string,string>>();
    if (dto == null || !dto.ContainsKey("description") || string.IsNullOrWhiteSpace(dto["description"]))
        return Results.BadRequest();
    var id = System.Threading.Interlocked.Increment(ref idCounter);
    var item = new TaskItem(id, dto["description"].Trim(), false);
    store[id] = item;
    return Results.Created($"/api/tasks/{id}", item);
});

app.MapPut("/api/tasks/{id}/toggle", (int id) =>
{
    if (!store.TryGetValue(id, out var existing)) return Results.NotFound();
    var updated = existing with { IsCompleted = !existing.IsCompleted };
    store[id] = updated;
    return Results.Ok(updated);
});

app.MapDelete("/api/tasks/{id}", (int id) =>
{
    if (!store.TryRemove(id, out _)) return Results.NotFound();
    return Results.NoContent();
});

app.Run("http://localhost:3000");
