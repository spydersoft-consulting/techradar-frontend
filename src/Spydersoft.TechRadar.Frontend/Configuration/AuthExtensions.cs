using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using Spydersoft.TechRadar.Frontend.Options;

namespace Spydersoft.TechRadar.Frontend.Configuration
{
    public static class AuthExtensions
    {
        public static void AddAuthentication(this IServiceCollection services, ConfigurationManager configuration)
        {
            var identityOptions = new IdentityOptions();
            configuration.Bind(IdentityOptions.SectionName, identityOptions);

            services.AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
                options.DefaultSignOutScheme = OpenIdConnectDefaults.AuthenticationScheme;
            })
            .AddCookie(options =>
            {
                options.LoginPath = "/Auth/Login";
                options.LogoutPath = "/Auth/Logout";
                options.Cookie.SecurePolicy = CookieSecurePolicy.None;
                options.Cookie.SameSite = SameSiteMode.None;
                options.Cookie.HttpOnly = false;
            })
            .AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, options =>
            {
                options.Authority = identityOptions.Authority;
                options.ClientId = identityOptions.ClientId;
                options.ClientSecret = identityOptions.ClientSecret;
                options.ResponseType = OpenIdConnectResponseType.CodeIdToken;
                options.ResponseMode = OpenIdConnectResponseMode.FormPost;

                options.Scope.Clear();
                options.Scope.Add("openid");
                options.Scope.Add("profile");
                options.Scope.Add("email");
                options.Scope.Add("techradar.data");
                options.Scope.Add("read");

                options.CallbackPath = "/auth/signin-oidc";

                options.SaveTokens = true;
                options.GetClaimsFromUserInfoEndpoint = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    NameClaimType = "name",
                    RoleClaimType = "https://schemas.spydersoft.com/roles"                    
                };

                options.Events = new OpenIdConnectEvents
                {
                    OnRedirectToIdentityProvider = context =>
                    {
                        context.ProtocolMessage.SetParameter("audience", identityOptions.Audience);
                        return Task.CompletedTask;
                    }
                };  
            });
        }
    }
}
