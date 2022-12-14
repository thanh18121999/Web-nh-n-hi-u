using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Text;
using Newtonsoft.Json;
using Project.RSA;


public class EncryptedData
{
    public string Encrypted {get;set;}
}
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class DecryptedAttribute :  Attribute, IAuthorizationFilter
{
    public async void OnAuthorization(AuthorizationFilterContext context)
    {
        
        var reader = new StreamReader(context.HttpContext.Request.Body,encoding: Encoding.UTF8, detectEncodingFromByteOrderMarks: false);
        string rawContent = await reader.ReadToEndAsync();

            Console.WriteLine(rawContent);



        var result = JsonConvert.DeserializeObject<EncryptedData>(rawContent);

        if (result == null || !string.IsNullOrEmpty(result.Encrypted))
        {
            IRsaService RsaService = new RsaService();
            string decrypted_jsondata = RsaService.Decrypt(result.Encrypted);

            Console.WriteLine(result.Encrypted);
            
            //Console.WriteLine(rawContent);
            byte[] byteArray = Encoding.UTF8.GetBytes(decrypted_jsondata);
            //byte[] byteArray = Encoding.ASCII.GetBytes(contents);
            MemoryStream stream = new MemoryStream(byteArray);
            context.HttpContext.Request.Body = stream;
        }
        else 
        {
            context.Result = new JsonResult(new { message = "Invalid Encryted Data" }) { StatusCode = StatusCodes.Status400BadRequest };
        }


        
        
    }

}