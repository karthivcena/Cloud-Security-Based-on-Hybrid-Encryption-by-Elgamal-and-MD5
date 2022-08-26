const userId = document.getElementById('userId');
/*const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const age = document.getElementById('age');*/
const addBtn = document.getElementById('addBtn');

const database = firebase.firestore();

const usersCollection = database.collection('users');
var en_msg,key,q;
decBtn.addEventListener('click', eh =>{gettext();});
function gettext(){
   u=prompt("Enter User Id ");
    usersCollection.doc(u).get()
      .then((doc)=>{
        if (doc.exists) {
          code=prompt("Enter secret code for decryption");
          en_msg=doc.get( 'story');
          q=doc.get("q");
          key=doc.get("key");
          console.log("msg=",en_msg);
          console.log("key=",key,"q=",q);
          dec=decrypt(en_msg, code, key, q);
          dmsg=dec.join('');
          alert("Decrypted Message :"+JSON.stringify(dmsg));
        }
      });
}
addBtn.addEventListener('click', e => {
  main();
  e.preventDefault();

database.collection('users').doc(userId.value).set({
  	    story: en_msg,
        key: key,
        q: q
  })
  .then(() => {
  	console.log("Saved successfully");
  })
  .catch( err => {
  	console.log("Error")
  })
});
function randInt(x1,q1){
    var ke = Math.floor((Math.random()*(q1-x1))+x1);
    return ke;
}
var a;
a = randInt(2,10);
function gcd(a1, b1) {
  let hcf;
// take input
for (var i = 1; i <= a1 && i <= b1; i++) {

  // check if is factor of both integers
  if( a1 % i == 0 && b1 % i == 0) {
      hcf = i;
  }
}
return hcf;
}

function gen_key(q) {
    let k2,x2,trip=0;
    x2=100000;
    k2 = randInt(x2,q);
    while (gcd(q, k2)!== 1) {
        if (trip===0){k2++;}
        else{
          k2--;
        }

    }
    return k2;
}
function power(a, b, c) {
    let x, y;
    x = 1;
    y = a;
    while (b > 0) {
        if ((b % 2) === 0) {
            x = (x * y) % c;
        }
        y = (y * y) % c;
        b = Number.parseInt((b / 2));
    }
    return (x % c);
}
function encrypt(msg, q, h, g) {
    let k, p, s;

    let _pj_a = msg.length;
    en_msg = Array(_pj_a);
    k = gen_key(q);
    s = power(h, k, q);
    p = power(g, k, q);
    console.log("g^k used : ", p);
    console.log("g^ak used : ", s);
    for (i = 0; (i < _pj_a); i += 1) {
        en_msg[i] =s * msg.charCodeAt(i);
    }
    str=String.fromCharCode(en_msg);
    console.log("encrypted msg: ",JSON.stringify(en_msg));
    alert("encrypted_msg is"+JSON.stringify(en_msg));
    console.log("p is ",p)
    return [en_msg, p];
}
function decrypt(en_msg, p, key, q) {
    let dr_msg, h;
    let _pj_a = en_msg.length;
    dr_msg=Array(_pj_a);
    
    h = power(p, key, q);
    for (var i = 0; (i < _pj_a); i += 1) {
        dr_msg[i]=String.fromCharCode((en_msg[i]/ h));
        ///console.log("cha",en_msg.charCodeAt(i));
    }
    message=dr_msg.join(' ');
    console.log("decrypted msg: ",dr_msg);
    return dr_msg;
}
function main() {
    let file, dmsg="", dr_msg,n, f, g, h, msg, p;
    file = 0;
    msg = document.getElementById('story').value;
    if (msg === "F") {
        f = open(window.prompt("enter file location"), "r");
        msg = f.read().splitlines();
        f.close();
        file = 1;
    }
    else{
    console.log("Original Message :"+ msg);
    q = randInt(1000,1000000);
    console.log("q used : ", q);
    g = randInt(2, q);
    console.log("g used : ", g);
    key = gen_key(q);
    console.log("key used : ", key);
    h = power(g, key, q);
    console.log("g^a used : ", h);}
    if (file === 1) {
       let pa = msg, pb = msg.length;
        for (var i, _pj_c = 0; (pc < pb); pc ++) {
            i = _pj_a[_pj_c];
            n=encrypt(i, q, h, g);
            en_msg=n[0];
            p=n[1];
            dr_msg = decrypt(en_msg, p, key, q);

            dmsg=dr_msg.join('')


        }
    }
    else{
    n = encrypt(msg, q, h, g);
    en_msg=n[0];
    p=n[1];
    alert( "private key is "+p);
    dr_msg = decrypt(en_msg, p, key, q);
    dmsg=dr_msg.join('');
    alert("Decrypted Message :"+JSON.stringify(dmsg));
}}
