/*
    Beírtuk, hogy npm init 
    Ilyenkor kapunk egy package.json fájlt 
    ->
{
    "name": "express_back_3",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "type": "module",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "",
    "license": "ISC"
}
    fontos, hogy itt majd a "type":"module"-t hozzá kell majd adni!!! 

    ezután pedig npm i express 
*/
import express, { urlencoded } from "express";

const app = express();
/*
    npm i ejs 
    és a app.set-vel -> 
*/
app.set("view engine", "ejs");

/*
    Csinálunk egy views meg egy assets mappát
    A views-ban lesz egy ilyen, hogy home.ejs 
    ahol egyenlőre még csak ezt írtuk be -> <h1>This is the home page!</h1>
    
    de majd azért kell ez az home.ejs, mert majd erre fogjuk render-elni a ("/") főoldalt
    res.render("home");
*/

//ez lesz majd a főoldal
app.get("/", (req, res)=> {
    res.render("home");
});

//itt pedig megcsináljuk a szervert 
app.listen(3000, console.log("The server is listening on port 3000"));
/*
    és akkor ha ezt meg szeretnénk nézni hogy http://localhost:3000
    akkor kell egy ilyen, hogy nodemon index 
    NODEMON !!!!!! 
*/

/*
    De majd több oldalra lesz szükség, ezért feltelepítjük a express-ejs-layouts-ot 
    npm i express-ejs-layouts
    amitt be is kell majd importolni meg use-olni is!! 
*/
import expressEjsLayouts from "express-ejs-layouts";
app.use(expressEjsLayouts);
app.use(urlencoded({extended: true}));

/*
    Csinálunk a views-ben egy layouts mappát, amiben lesz egy layout_public.ejs meg egy admin is!!
    de fontos, hogy elötte kell csinálni egy common mappát ugyanide a views-ba, ahol majd lesz a head.ejs

    így néz ki most a head, de még nem csináltunk egy CSS fájlt, amit majd lehet ide linkelni
    ->
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%=title%></title>
</head>

ez meg a layouts

<!DOCTYPE html>
<html lang="en">
     <%- include("../commen/head", {title: "Admin felület"}) %>
<body>
    <%- body %>
</body>
</html>

a public meg az admin is nagyon hasonló, csak annyi, hogy az lesz majd átadva, hogy publikus a másikon meg az, hogy admin felület!! 
mert
-> 
A head az majd vár egy title-t, hogy mi legyen kiírva, amikor megnyitjuk azt az oldalt és ezt várja 
title><%=title%></title>
és majd ahol meghívjuk ott megadjuk neki 
hol hívjuk meg 
-> 
majd az admin_layout meg a public_layout-ban 
->
<%- include("../commen/head", {title: "Admin felület"}) %>
és itt ezt át is adjuk neki, az egyiken admin másikon meg azt, hogy publikus felület!!!!!!! 

Tehát meg van a home.ejs, ahol csak annyit írtunk ki, hogy this is the home page!
és akkor kell neki egy layout is!!! ez -> {layout: "./layouts/public_layout"}
->
*/
app.get("/", (req, res)=> {
    res.render("home", {layout: "./layouts/public_layout"});
});

/*
    Mégegyszer, a head-et átadtuk az include-val a public/admin_layout-nak, de még várt egy title-t is, amit megadtuk, akkor amikor 
    include-oltuk, tehát megadtuk az elérési útvonalát a head.ejs-nek és emellett átadtuk, hogy mi legyen a title egy {}-ben!! 
    <%- include("../commen/head", {title: "Admin felület"}) %>
    és a head-ben ez lesz majd megjelenítve -> <title><%=title%></title>
    ***************************************************************************************
*/

/*
    Az assets-ben létrehozunk egy styles.css
    de ehhez nagyon fontos, hogy a statikus fájlokat is lássa majd a rendszer -> express.static()-ot kell majd use-olni 
    és megadni a mappa nevét, amiben van a CSS fájl -> assets
*/
app.use(express.static("assets"));

/*
    És ha meg van a style.css, akkor azt majd a head.ejs-ben linkelni is kell, mert ez az értelme az egésznek, hogy azt majd megkapják 
    a layouts-ok, azokat meg majd itt megadjuk, pl. hogy layout: layouts/admin_layout 
    ->
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%=title%></title>
    <link rel="stylesheet" href="../style.css">
</head>

és megcsináljuk a style.css-t *-ot, containter meg ilyeneket 
<div class="container">
    <form method="post" action="/" class="box">
        <h3>Bejelentkezés</h3>
        <input type="text">

        <h4>Felhasználónév</h4>
        <input style="width: 100%;" name="userName" type="text">

        <h4>Jelszó</h4>
        <input style="width: 100%;" name="pass" type="password">

        <button>Bejelentkezés</button>
    </form>
</div>

Megcsináltuk a home-ot
Ami itt nagyon fontos, hogyha form van input-okkal 
1. kell minden input-nak egy name attributumot, mert amit majd innen visszakapunk a name attributumok lesznek a kulcsok, amit meg beleírunk az érték 
2. method: "post" ha form van, akkor biztos, hogy a method az post lesz 
3. action: -> hogy melyik url-re vigyen minket innen, ha a felhasználó a button-vek beküldte a form-ot 

és akkor itt már érvényesek css-ek, tehát itt adunk egy class container-t és azt a style.css-en meg is lehet csinálni/formázni 
*/ 

/*
    Mit kell csinálni, hogy be tudjunk jelentkezni -> egy post-os endpoint-ot!!! 
    és ez oda fog minket majd vinni, hogy /login -> <form method="post" action="/login" class="box"> 
*/ 
app.post("/login", (req, res)=> {
    console.log(req.body);

    res.redirect("profile");

    res.render("profile", {layouts: "./layouts/admin_layout"});
});
/*
    Mi fog ilyenkor történni
    -> 
    Hogy a home.ejs-en van egy form és az el fogja küldeni az adatokat egy login nevű endpoint-ra, mert az van megadva, hogy action="/login"
    és a login, amit itt csináltunk az meg render-elni fogja nekünk a profile-t!!!! 
    ->
    app.post("/login", (req, res)=> {
    console.log(req.body);

    res.render("profile");
});
    de ha már be vannak állítva a layouts-ok, akkor kötelező kitölteni őket, tehát kell ez
    ->
    {layouts: "./layouts/admin_layout"}; -> res.render("profile", {layouts: "./layouts/admin_layout"});

    És ilyenkor ha kitöltöttük a form-ot és megnyomtuk a beküldés gombot, akkor átvisz minket egy /login-ra, ahol meg 
    megjelenítünk, amit akarunk pl. adatokat, amiket beszedtünk a form-ból (csak akkor át kell adni a req.body-t) 
    a profile.ejs-en meg megjeleníteni 

    De ennek valójában úgy kéne müködnie, hogy le kellenne ellenőriznünk azt, hogy a beírt jelszó meg a felhasználónév az rendben van-e 
    Hogyha rendben van, akkor írányit át minket az egyik helyre, ha meg nincsen rendben, akkor meg a másikra
    -> 
    res.redirect(); -> res.redirect("profile");
    De ez a profile még nincsen meg az endpoint-ja 

    tehét lesz egy post-os kérés, ahol minket átírányit a res.redirect()-vel a /profile-ra 
    megcsináljuk egy get-es kéréssel a /profile-t 
    ->
*/
app.post("/login", (req, res)=> {
    console.log(req.body);
    res.redirect("/profile");
});

//itt megcsináljuk a /profile-t, ahol meg a render-vel megjelenítjük, ami van a profile.ejs-en!!! 
app.get("/profile", (req, res)=> {
    res.render("profile", {layout: "./layouts/admin_layout"});
});
/*
    És akkor egyből ha beírjuk az adatokat a / (localhost:3000)-en és megnyomjuk, hogy beküldés, akkor ez fog megjelenni az URL-ben 
    ->
    localhost:3000/profile és az jelenik meg ami a profile.ejs-en van 

    De mikor kell nekünk ide a profile-ra redirect-elni, ha a felhasználó jól irta be a jelszót!!! 
    Most ezt még nem fogjuk adatbázisban tárolni, hanem itt csinálunk (a post kérésben) egy user tömböt 
*/

app.post("login", (req, res)=> {
    const users = [{
        email: "kovacs.oliver1989@gmail.com",
        pass: "asdf"
    }];
    console.log(req.body);
    res.redirect("/profile");
});
/*
    Meg kell nézni, hogy ami itt van a const users-ben az megegyezik azzal, amit beírtunk a form-ban, tehát itt majd megkapunk a 
    req.body-ban!!!!!!! 
    <form method="post" action="/login" class="box">
        <h3>Bejelentkezés</h3>
        <input type="text">

        <h4>Email</h4>
        <input style="width: 100%;" name="email" type="text">

        <h4>Jelszó</h4>
        <input style="width: 100%;" name="pass" type="password">

        <button>Bejelentkezés</button>

    Nyilván, akkor itt egyezniük kell, hogy email van meg jelszó azzal amit itt a users-ben csináltunk objektumot 
    tehát a form-nál is a name email meg pass legyen meg itt is a users-ben is 
        const users = [{
        email: "kovacs.oliver1989@gmail.com",
        pass: "asdf"
    }];

    Hogyan lehet ezt megnézni, összehasonlítani 
    ->
    mivel ez egy tömb és lehetnek benne tömb objektumok is (jelen esetben csak egy van, de ez nem életszerű)
    -> 
    const index = users.findIndex((u)=>u.email === req.body.email && u.pass === req.body.pass);
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    és megnézzük, hogy ez az index mi lesz, mert a findIndex az úgy müködik, hogyha nem találja meg az adott feltételekkel rendelkező 
    tömbelemet, tehát itt ez a feltétel -> (u.email === req.body.email && u.pass === req.body.pass)
    akkor -1-et add vissza!!! 
    console.log(index);
    Tehát ha ez az index az -1, akkor nem a profile-ra fogunk átírányítani (mert nem sikerült bejelentkezni), hanem a home-ra 
    ->
    if(index === -1) {
        res.redirect("/");
    } else {
        res.redirect("/profile"); 
    }
*/
app.post("/login", (req, res)=> {
    const users = [{
        email: "kovacs.oliver1989@gmail.com",
        pass: "jelszó"
    }];
    //most jön a findIndex-es összehasonlítása ennek a tömb értékeinek és a req.body-ból visszakapott értékeknek 
    const index = users.findIndex((u)=>u.email === req.body.email && u.pass === req.body.pass);
    console.log(index);

    //ha itt -1-et kapunk vissza az index-re, akkor az azt jelenti, hogy nem találtunk semmit a feltételek szerint, tehát nincs benne a users-ben 
    if(index === -1) {
       // res.redirect("/"); ha rossz adatokat írt be a felhasználó, akkor visszaírányítjuk a / (home-ra)
       /*
        de itt az url-ben még lesz egy olyan, hogy wrong-credentials=1 és innen tudhatjuk, hogy már be próbált jelentkezni!!! 
       */
        res.redirect("/?wrong-credentials=1");
    } else {
        res.redirect("/profile"); //ha viszont jókat, akkor meg tovább a /profile-ra 
    }
});

/*
    és ha van olyan, hogy wrong-credentials, akkor kiírunk valamit 
    Tehét, ha jól jelentkezünk be, akkor -> http://localhost:3000/profile 
    ha meg nem, akkor http://localhost:3000/?wrong-credentials=1
    visszavit, minket a főoldalra, de úgy, hogy benne van még, hogy ?wrong-credentials=1

    Hogyan tudjuk a felhasználó számára adni, hogy ez mit is jelent (mert ő nem fogja megnézni az URL változót, hogy mi van benne)
    -> 
    itt kell, hogy req.query!!!!!!!!!! ez a query string-ünk 
    és ahol csináltuk a / (home-ot) ott átadunk egy wrongCredentials és ott fogjuk majd használni, hogy 
    req.query[wrong-credentials] (mert kötőjellel írtuk a query-be) ezért itt is úgy kell, mert meg akarjuk nézni, hogy ez létezik-e 
    és ha létezik akkor azt mondjuk itt, hogy true különben meg, hogy false!!!!! 
    wrongCredentials: req.query[wrong-credentials] ? true : false
    ->
*/
app.get("/", (req, res)=> {
    res.render("home", {
        layout:"./layout/public_layout",
        wrongCredentials: req.query[wrong-credentials] ? true : false
    })
});

/*
    És akkor már csak annyi a feladatunk, hogy a home.ejs-ben egy if-et készítünk, és hogyha a wrongCredentials az true 
    akkor kiírjuk, hogy "Nem megfelelő felhasználónév/jelszó" és akkor a felhasználó is tudni fogja, hogy nem jót írt be!!!!!!!! 
    -> 
<% if(wrongCredentials) { %>
    <h3>Nem megfelelő felhasználónév/jelszó</h3>
<% } %>

Ez így jól kiírja, de csinálunk egy olyat a CSS-ben, hogy text-center, hogy középen legyen meg piros legyen 
-> 
<% if(wrongCredentials) { %>
    <h3 class="text-center color-red">Nem megfelelő felhasználónév/jelszó</h3>
<% } %>

Mi van, akkor ha jól írjuk be a felhasználónevet meg a jelszót, akkor meg ide visz minket -> http://localhost:3000/profile 

De majd a jelszó az egy adatbázisban lesz eltárolva titkosítva!!!! 
***********
Kell majd a admin_layout-ba egy navigációs menü 
és lesznek bent majd olyanok, hogy visszamegyünk a főoldalra stb. 
<html lang="en">
     <%- include("../commen/head", {title: "Admin felület"}) %>
<body>
    <nav>
        <ul>
            <li>
                <a href="/">Főoldal</a>
            </li>
            <li>
                <a href="/profile">Profile</a>
            </li>
            <li>
                <a href="/ships">Hajók</a>
            </li>
        </ul>
    </nav>
    <%- body %>
</body>

Megszerkeztjük CSS-ben a navigációs menüt 
és majd lesz egy olyan, hogy hajók, ott meg megjelenítünk dolgokat az adatbázisból!!!! 
-> 
CSS!!! nav, ul, li, a formázás 

Azt fontos mlg kijelőlni, hogy melyik oldalon vagyunk!!!! 
Tehát itt van a nav menünk és mindig átadunk page-vel, hogy hol vagyunk pl. a /profile-nál 
page:"/profile"
*/
app.get("/profile", (req, res)=> {
    res.render("profile", {layout: "./layouts/admin_layout", page:"profile"});
});
/*
    és akkor majd a layout-ban is látni fogjuk, hogy mi a page 
    tehát, ha ezt most valahova beírjuk az admin_layout.ejs-re, hogy <#=page#>
    akkor a localhost:3000/profile ki fogja írni, hogy profile 
    de nem ezt csináljuk, hanem majd megadunk egy class-t az li-knek 

    Most pl. a profile esetében de ezt majd az összes get-esnek meg kell adni, meg a li-knek is!!! 
    -> 
    .selected-menu {
    background-color: #1f6277;
}

    <li class="<%=page === 'profile' ? 'selected-menu' : ''%>">
        <a href="/profile">Profile</a>
    </li>
    <li class="<%=page === 'ships' ? 'selected-menu' : ''%>">
        <a href="/ships">Hajók</a>
    </li>

De még nincsen ilyen oldalunk, hogy ships 
Ezért ezt most megcsináljuk, meg csinálunk egy ships.ejs-t is!!!! 
-> 
*/

app.get("/ships", (req, res)=> {
    res.render("ships", {
        layout: "./layouts/admin_layout",
        page: "ships"
    })
});
/*
    Meg is van a hajónk (localhost:3000/ships) és ki is van jelölve a nav menüben, hogy azon vagyunk 
    És ide meg szeretnénk jeleníteni a hajóinkat 
    ->
    npm i mysql2
*/
import mysql from "mysql2";

//és csinálunk egy conn-t is!!!! 
const conn = mysql.createConnection({
    host: "127.0.0.1",
    user: "root", 
    pass: "",
    database: "vitorlasberles"
});

/*
    és ami nagyon fontos, hogy ez egy async folyamat, ezért ahol get-eljük a ships-t ott a függvénynek ASYNC-nek kell lennie!!!!!! 
*/

app.get("/ships", async (req, res)=> {
    const response = await conn.promise().query(`SELECT * FROM hajo`);
    console.log(response);
    /*
        fontos, hogy van itt két tömb, az első amiben vannak az adatok és második, hogy milyen mezők érintettek a lekérdezésben, mivel 
        itt *, ezért az összes 
        és ezért majd úgy kell visszaadni ezt a dolgot, hogy response[0] !!!!! 
    */
    res.render("ships", {
        layout: "./layouts/admin_layout",
        page: "ships",
        ship: response[0] //itt adjuk meg az adatokat, amik lejöttek az sql-ből 
    })
});
/*
    megcsináljuk a ships.ejs-t 
    <div class="container">
    <h1>Hajók</h1>

<div class="ships-grid">
        <% ships.forEach((s)=> { %>
            <div class="ship-data">
                <h4><%=s.nev%></h4>
            </div>
        <% })%>
    </div>
</div>
*/