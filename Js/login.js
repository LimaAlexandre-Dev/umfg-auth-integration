var body = document.querySelector("body");
var signInButton = document.querySelector("#signIn");
var signUpButton = document.querySelector("#signUp");

body.onload = function () {
  body.className = "on-load";
};

signInButton.addEventListener("click", function () {
  body.className = "sign-in";
});

signUpButton.addEventListener("click", function () {
  body.className = "sign-up";
});

const API_BASE = "https://umfgcloud-autenticacao-service-7e27ead80532.herokuapp.com";

document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.getElementById("register");
  const loginBtn = document.getElementById("access");

  if (registerBtn) {
    registerBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const email = document.querySelector(".first-content input[type='email']").value;
      const senha = document.querySelector(".first-content input[type='password']").value;
      const senhaConfirmada = document.querySelector("#confirm-password").value;

      if (!email || !senha || !senhaConfirmada) {
        alert("Preencha todos os campos!");
        return;
      }

      if (senha !== senhaConfirmada) {
        alert("As senhas não coincidem!");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/Autenticacao/registar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha, senhaConfirmada })
        });

        const responseText = await res.text();

        if (res.ok) {
          try {
            const parsed = JSON.parse(responseText);
            localStorage.setItem("user", JSON.stringify({
              email,
              expiration: parsed.expiration || parsed.dataExpiracao,
              token: parsed.token
            }));
          } catch {
            // Caso a resposta seja apenas texto
            localStorage.setItem("user", JSON.stringify({ email }));
          }

          window.location.href = "welcome.html";
        } else {
          alert(responseText);
        }
      } catch (err) {
        console.error(err);
        alert("Erro ao se conectar com a API.");
      }
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const email = document.querySelector(".second-content input[type='email']").value;
      const senha = document.querySelector(".second-content input[type='password']").value;

      if (!email || !senha) {
        alert("Preencha todos os campos!");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/Autenticacao/autenticar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha })
        });

        const responseText = await res.text();

        if (res.ok) {
          const data = JSON.parse(responseText);
          localStorage.setItem("user", JSON.stringify({
            email,
            expiration: data.expiration || data.dataExpiracao,
            token: data.token
          }));
          window.location.href = "welcome.html";
        } else {
          alert(responseText);
        }
      } catch (err) {
        console.error(err);
        alert("Erro ao se conectar com a API.");
      }
    });
  }
});
