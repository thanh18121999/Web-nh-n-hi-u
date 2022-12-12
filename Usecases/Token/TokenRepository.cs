using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace Project.UseCases.Tokens
{
    public class TokenRepository : ITokenRepository
    {
        private readonly double EXPIRY_DURATION_MINUTES = 86400;
        private readonly IConfiguration _config;
        private readonly string JWT_token_secret_key;
        private readonly string JWT_token_issuer;
        public TokenRepository(IConfiguration config)
        {
            this._config = config;
            //this.EXPIRY_DURATION_MINUTES = _config["Jwt:TimeExpired"];
            this.JWT_token_secret_key = _config["Jwt:Key"];
            this.JWT_token_issuer = _config["Jwt:Issuer"];
        }
        public string BuildToken(Claim[] claims)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JWT_token_secret_key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);
            var tokenDescriptor = new JwtSecurityToken(JWT_token_issuer, JWT_token_issuer, claims,
                expires: DateTime.Now.AddMinutes(EXPIRY_DURATION_MINUTES), signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }
        public bool IsTokenValid(string token)
        {
            var mySecret = Encoding.UTF8.GetBytes(JWT_token_secret_key);
            var mySecurityKey = new SymmetricSecurityKey(mySecret);

            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = JWT_token_issuer,
                    ValidAudience = JWT_token_issuer,
                    IssuerSigningKey = mySecurityKey,
                }, out SecurityToken validatedToken);
            }
            catch
            {
                return false;
            }
            return true;
        }
        public ClaimsPrincipal GetClaimsPrincipalFromToken(string token){
            try {
                var tokenHandler = new JwtSecurityTokenHandler();
                //var key = Encoding.UTF8.GetBytes(JWT_token_secret_key);
                var mySecret = Encoding.UTF8.GetBytes(JWT_token_secret_key);
                var mySecurityKey = new SymmetricSecurityKey(mySecret);

                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters{
                    ValidateIssuerSigningKey = true,
                        IssuerSigningKey = mySecurityKey,
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidIssuer = JWT_token_issuer,
                        ValidAudience = JWT_token_issuer,
                        ValidateLifetime = true
                }, out SecurityToken validatedToken);
                var jwtToken = (JwtSecurityToken)validatedToken;
                return principal;
            }
            catch {
                throw new SecurityTokenException("Invalid token");
            }
        }
    }
}