using db_back.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Events;
using System;
using System.Collections.Generic;
using System.Data.Odbc;
using System.IO;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace db_back
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();

            services.AddCors();

            // Добавляем JWT схему валидации
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        context.Token = context.Request.Cookies["jwt_token"];
                        return Task.CompletedTask;
                    }
                };

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = Configuration["JWT:Isuser"],
                    ValidAudience = Configuration["JWT:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:Key"])),
                    ValidateIssuer = false,
                    ValidateAudience = true,
                    ValidateLifetime = false,
                    ValidateIssuerSigningKey = false
                };
            });
            services.AddAuthorization();

            services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = @"Введите JWT токен авторизации.",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "Bearer"
                });
                options.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        },
                    },
                    new List<string>()
                    }
                });

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                options.IncludeXmlComments(xmlPath);
            });

            string connectionString = Configuration.GetConnectionString("DefaultConnection");
            services.AddTransient<OdbcConnection>(_ => new OdbcConnection(connectionString));

            services.AddScoped<IItemRepository, ItemRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<IStatsRepository, StatsRepository>();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            Log.Logger = new LoggerConfiguration()
                            .MinimumLevel.Debug()
                            .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                            .Enrich.FromLogContext()
                            .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}]{RequestId} {Message:lj}{NewLine}{Exception}")
                            .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day, outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}]{RequestId} {Message:lj}{NewLine}{Exception}")
                            .CreateLogger();
            app.UseSerilogRequestLogging();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseSwagger()
               .UseSwaggerUI(c =>
               {
                   c.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
               });

            //app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseCors(builder => builder.AllowAnyOrigin());

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";
            });
        }
    }
}
