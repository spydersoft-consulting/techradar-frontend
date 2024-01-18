using Microsoft.AspNetCore.Authentication;
using System.Net.Http.Headers;
using Yarp.ReverseProxy.Transforms;

namespace Spydersoft.TechRadar.Frontend.Configuration
{
    public static class YarpExtensions
    {
        private static string ConfigurationSectionName = "YarpSettings";

        public static void AddProxy(this IServiceCollection services, ConfigurationManager configuration)
        {
            var reverseProxyConfig = configuration.GetSection(ConfigurationSectionName) ?? throw new ArgumentException($"{ConfigurationSectionName} section is missing!");

            services.AddReverseProxy()
                .LoadFromConfig(reverseProxyConfig)
                .AddTransforms(builderContext =>
                {
                    builderContext.AddRequestTransform(async transformContext =>
                    {
                        var accessToken = await transformContext.HttpContext.GetTokenAsync("access_token");
                        if (accessToken != null)
                        {
                            transformContext.ProxyRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                        }
                    });
                });
        }
    }
}
