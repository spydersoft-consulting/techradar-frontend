using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spydersoft.TechRadar.Frontend.Models;
using System.Security.Claims;

namespace Spydersoft.TechRadar.Frontend.Controllers
{
    [Route("[controller]/[action]")]
    public class AuthController : Controller
    {
        [HttpGet]
        public ActionResult Login(string returnUrl = "/")
        {
            return new ChallengeResult(OpenIdConnectDefaults.AuthenticationScheme, new AuthenticationProperties() { RedirectUri = returnUrl });
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult> Logout()
        {
            await HttpContext.SignOutAsync();

            return new SignOutResult(OpenIdConnectDefaults.AuthenticationScheme, new AuthenticationProperties
            {
                RedirectUri = Url.Action("Index", "Home")
            });
        }

        [HttpGet]
        public ActionResult<UserInfo> GetUser()
        {
            if (User.Identity is not null && User.Identity.IsAuthenticated)
            {
                // TODO:  Determine if we need to return claims here
                //var claims = ((ClaimsIdentity)User.Identity).Claims.Select(c =>
                //    new { type = c.Type, value = c.Value });

                return Json(new UserInfo { IsAuthenticated = true, Name = User.Identity.Name });
            }

            return Json(new UserInfo { IsAuthenticated = false });
        }
    }
}
