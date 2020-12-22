(function() {
  const VAPID_KEY= 'RhKokPK8LFujUoNQ1ktjSzGxwr67F6aiMlqTLM_YNv4'
  const BACK_URL ='http://localhost:5000'
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
   
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
   
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
 
 
  if(ServiceWorker in navigator)
{
  navigator.serviceWorker.register("sw.js",{scope:'.'}).then(register => {
    console.log("service worker successfully")
    if("Notification" in window){
      Notification.requestPermission(result => {
        if(result == 'granted'){
          console.log('granded :)')
          register.pushManager.subscribe({
            userVisibleOnly: true, //samo nas korisnik vidi notifikacije
            applicationServerKey: urlBase64ToUint8Array(VAPID_KEY)
          }).then(subsciption => {
            fetch(BACK_URL + '/subscribe',{
              method: "POST",
              body: JSON.stringify(subsciption),
              headers: {
                "content-type":"application/json"
              }
            })
          })
        }
      })
    }
  })
}
  const cardHTML = `\
<div class="col">
    <div class="card" style="width: 18rem;">
        <img
        class="card-img-top"
        src="%link-slika%"
        />
        <div class="card-body">
            <h5 class="card-title">%naslov%</h5>
            <p class="card-text">
            %opis%
            </p>
            <hr>
            <a href="%link-slika%" target="_blank" class="btn btn-primary">Otvori sliku</a>
        </div>
    </div>
</div>`;

  function getInputs() {
    return {
      opis: document.querySelector("#opis"),
      naslov: document.querySelector("#naslov"),
      slika: document.querySelector("#link-slika")
    };
  }

  function resetInputs() {
    let inputs = getInputs();
    for (let key in inputs) inputs[key].value = "";
  }

  function addToDOM(data) {
    let container = document.querySelector("#container-cards");
    let card = cardHTML.replace("%link-slika%", data.slika.value);
    card = card.replace("%link-slika%", data.slika.value);
    card = card.replace("%opis%", data.opis.value);
    card = card.replace("%naslov%", data.naslov.value);
    container.insertAdjacentHTML("beforeend", card);
  }

  let btnSacuvaj = document.querySelector("#sacuvaj");
  btnSacuvaj.addEventListener("click", function() {
    let inputs = getInputs();
    if (
      inputs.opis.value.length > 0 &&
      inputs.slika.value.length > 0 &&
      inputs.naslov.value.length > 0
    )
      addToDOM(inputs);

    resetInputs();
  });

  document.querySelector("#odbaci").addEventListener("click", resetInputs);
})();
