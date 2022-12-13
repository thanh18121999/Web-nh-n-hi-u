using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project.RSA
{
    public interface IRsaService
    {
        string Encrypt(string text);
        string Decrypt(string encrypted);
        string getPublicKey();

    }
}