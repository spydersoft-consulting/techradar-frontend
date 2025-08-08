using Microsoft.AspNetCore.Authentication;
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
