'use strict';
const loginLanguage = new URLSearchParams(location.search).get('lang');
const loginText = (de, fr, en) => loginLanguage === 'fr' ? fr : loginLanguage === 'en' ? en : de;

if (loginLanguage === 'fr' || loginLanguage === 'en') {
  document.documentElement.lang = loginLanguage;
  document.title = loginText('Anmeldung', 'Connexion', 'Sign in') + ' — StudyBridge';
  const translations = {
  ".eyebrow": [
    "ESPACE PERSONNEL",
    "PERSONAL SPACE"
  ],
  "#auth-title": [
    "Connexion",
    "Sign in"
  ],
  "[for=username]": [
    "Identifiant",
    "Username"
  ],
  "[for=password]": [
    "Mot de passe",
    "Password"
  ],
  "#register-extra p": [
    "12 caractères minimum. Identifiant : lettres sans accents, chiffres, point, tiret et underscore.",
    "At least 12 characters. Usernames can contain letters A–Z, digits, periods, hyphens and underscores."
  ],
  "[for=confirm-password]": [
    "Confirmer le mot de passe",
    "Confirm password"
  ],
  "[for=invitation]": [
    "Code d’invitation si demandé",
    "Invitation code if required"
  ],
  "#auth-submit": [
    "Se connecter →",
    "Sign in →"
  ],
  "#toggle-auth": [
    "Créer un compte",
    "Create account"
  ],
  "section > p.muted": [
    "Mot de passe oublié ? Arrête le serveur puis ouvre RECUPERER-COMPTE.cmd sur cet ordinateur.",
    "Forgot your password? Stop the server and open RECUPERER-COMPTE.cmd on this computer."
  ],
  "main > a.text-link": [
    "← Retour au site",
    "← Back to the site"
  ]
};
  for (const [selector, [fr, en]] of Object.entries(translations)) {
    document.querySelector(selector).textContent = loginText('', fr, en);
  }
}
let registering=false;const el=id=>document.getElementById(id);
el('toggle-auth').onclick=()=>{registering=!registering;el('register-extra').hidden=!registering;el('auth-title').textContent=registering?loginText("Konto erstellen", "Créer un compte", "Create account"):loginText("Anmeldung", "Connexion", "Sign in");el('auth-submit').textContent=registering?loginText("Erstellen →", "Créer →", "Create →"):loginText("Anmelden →", "Se connecter →", "Sign in →");el('toggle-auth').textContent=registering?loginText("Bereits registriert", "Déjà inscrit", "Already registered"):loginText("Konto erstellen", "Créer un compte", "Create account");el('password').autocomplete=registering?'new-password':'current-password';el('password').minLength=registering?12:1;el('confirm-password').required=registering;el('auth-message').textContent=''};
el('auth-form').onsubmit=async event=>{event.preventDefault();if(registering&&el('password').value!==el('confirm-password').value){el('auth-message').textContent=loginText("Die Kennwörter stimmen nicht überein.", "Les mots de passe diffèrent.", "Passwords do not match.");return}el('auth-submit').disabled=true;try{const response=await fetch('/api/auth/'+(registering?'register':'login'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:el('username').value,password:el('password').value,code:el('invitation').value})});const data=await response.json();if(!response.ok){const messages={invalid_login:loginText("Benutzername oder Kennwort ist falsch.", "Identifiant ou mot de passe incorrect.", "Incorrect username or password."),username_taken:loginText("Dieser Benutzername ist bereits vergeben.", "Identifiant déjà utilisé.", "Username already taken."),invalid_credentials_format:loginText("Der Benutzername muss 3 bis 40 Zeichen und das Kennwort mindestens zwölf Zeichen enthalten.", "Identifiant de 3 à 40 caractères et mot de passe de 12 caractères minimum.", "Username: 3–40 characters. Password: at least 12 characters."),invalid_invitation:loginText("Der Einladungscode ist ungültig.", "Code d’invitation incorrect.", "Incorrect invitation code."),rate_limited:loginText("Zu viele Versuche. Versuche es später erneut.", "Trop de tentatives. Réessaie plus tard.", "Too many attempts. Try again later."),invalid_origin:loginText("Die Adresse stimmt nicht mit PUBLIC_ORIGIN überein. Wende dich an die Person, die den Server betreibt.", "Adresse du site différente de PUBLIC_ORIGIN. Contacte la personne qui gère le serveur.", "Site address differs from PUBLIC_ORIGIN. Contact the server operator.")};throw new Error(messages[data.error]||loginText("Serverfehler.", "Erreur du serveur.", "Server error."))}location.assign('/#library')}catch(e){el('auth-message').textContent=e.message}finally{el('auth-submit').disabled=false}};
