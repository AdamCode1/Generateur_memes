let imageActuelle = null;
let mesBibliotheques = {
  memes: [],
};

document
  .getElementById("chargementImage")
  .addEventListener("change", chargerImage);

function chargerImage(evenement) {
  const fichier = evenement.target.files[0];

  if (!fichier) return;

  const lecteur = new FileReader();

  lecteur.onload = function (e) {
    document.getElementById("imageApercu").src = e.target.result;

    imageActuelle = e.target.result;
    alert(e.target.result);
    mettreAJourApercu();
  };
""
  lecteur.readAsDataURL(fichier);
}

function mettreAJourApercu() {
  const texteHaut = document.getElementById("texteHaut").value;

  const texteBas = document.getElementById("texteBas").value;

  document.getElementById("divTexteHaut").innerText = texteHaut;

  document.getElementById("divTexteBas").innerText = texteBas;
}

function genererMeme() {
  if (!imageActuelle) {
    alert("Veuillez charger une image !");
    return;
  }

  const texteHaut = document.getElementById("texteHaut").value;

  const texteBas = document.getElementById("texteBas").value;

  const nouveauMeme = {
    image: imageActuelle,

    texteHaut: texteHaut,

    texteBas: texteBas,
  };

  mesBibliotheques.memes.push(nouveauMeme);
  sauvegarderMemes();
  afficherGalerie();
}

function telechargerMeme() {
  if (!imageActuelle) {
    alert("Veuillez charger une image !");
    return;
  }

  const zoneApercu = document.getElementById("zoneApercu");

  html2canvas(zoneApercu).then((toile) => {
    const lien = document.createElement("a");

    lien.download = "mon-meme.jpg";
    console.log(lien.href);

    lien.href = toile.toDataURL("image/png");
    lien.click();
  });
}

function partagerMeme() {
  document.getElementById("monOverlay").style.display = "block";

  document.getElementById("menuPartage").style.display = "block";
}

function fermerMenuPartage() {
  document.getElementById("monOverlay").style.display = "none";

  document.getElementById("menuPartage").style.display = "none";
}

function partagerSur(reseau) {
  if (!imageActuelle) {
    alert("Veuillez charger une imag !");
    fermerMenuPartage();
    return;
  }

  html2canvas(document.getElementById("zoneApercu")).then((toile) => {
    const imageUrl = toile.toDataURL("image/png");
    let lienPartage = "";

    switch (reseau) {
      case "facebook":
        lienPartage = "https://www.facebook.com/";
        break;
      case "instagram":
        lienPartage = "https://www.instagram.com/";
        break;
      case "whatsapp":
        lienPartage = "https://wa.me;";
        break;
    }

    window.open(lienPartage, "_blank");
    fermerMenuPartage();
  });
}

function sauvegarderMemes() {
  localStorage.setItem("mesMemes", JSON.stringify(mesBibliotheques.memes));
}

function chargerMemes() {
  const memesEnregistres = localStorage.getItem("mesMemes");
  // console.log(memesEnregistres)
  if (memesEnregistres) {
    mesBibliotheques.memes = JSON.parse(memesEnregistres);
    afficherGalerie();
  }
}

function afficherGalerie() {
  const galerie = document.getElementById("galerieImages");
  galerie.innerHTML = "";

  mesBibliotheques.memes.forEach((meme, index) => {
    const img = document.createElement("img");

    img.src = meme.image;
    img.className = "meme-miniature";

    img.onclick = () => chargerMemeDansEditeur(index);
    galerie.appendChild(img);
  });
}

function chargerMemeDansEditeur(index) {
  const meme = mesBibliotheques.memes[index];
  imageActuelle = meme.image;
  document.getElementById("imageApercu").src = meme.image;

  document.getElementById("texteHaut").value = meme.texteHaut;

  document.getElementById("texteBas").value = meme.texteBas;
  mettreAJourApercu();
}

function html2canvas(element) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = document.getElementById("imageApercu");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    ctx.font = "bold 30px Arial";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";

    ctx.lineWidth = 3;

    ctx.textAlign = "center";

    const texteHaut = document.getElementById("divTexteHaut").innerText;

    const texteBas = document.getElementById("divTexteBas").innerText;

    ctx.strokeText(texteHaut, canvas.width / 2, 40);

    ctx.fillText(texteHaut, canvas.width / 2, 40);

    ctx.strokeText(texteBas, canvas.width / 2, canvas.height - 20);

    ctx.fillText(texteBas, canvas.width / 2, canvas.height - 20);

    resolve(canvas);
  });
}

window.onload = chargerMemes;
