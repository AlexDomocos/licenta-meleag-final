Prima dată se cloneaza repository-ul din github https://github.com/AlexDomocos/licenta-meleag-final
sau gitlab https://gitlab.upt.ro/alexandru.domocos/licenta-meleag-final
în repository sunt fișierele pentru aplicația React Native,pentru server-ul ce ruleaza pe raspberry Pi 
și codul pentru plăcuța arduino.

1.Aplicația în React Native
Se deschide un terminal și se acceseaza folderul în care este aplicația 

cd meleag-dulce-app

Dupa care instalăm dependențele necesare cu următoarea comandă

npm install

Ulterior vom instala Expo CLI pentru a putea rula aplicația. 

npm install -g expo-cli

Pasul următor e să rulăm aplicația

npx expo start

Dupa aceasta comanda ,vom avea 2 variante de vizualizare a aplicației 
1. Descărcăm aplicația mobilă Expo Go și scanăm codul QR
2. Apăsăm tasta 'i' sau 'a' în funcție de simulatorul pe care vrem sa îl folosim (iOS sau Android)

2.Codul Arduino 
Se va descărca aplicația Arduino IDE pe raspberry PI,se va deschide fișierul numit scrypt_arduino.ido
și se va încărca pe plăcuță.

3.Serverul pe raspberry Pi
Toate fișierele pentru server și baza de date se află în folderul server.
Pentru rularea acestuia se va deschide un terminal după care vom intra în folderul serverului cu comanda cd server
Se va folosi comanda node db-init.js pentru a inițializa baza de date,după care se va porni serverul cu node server.js

Pentru expunerea serverului vom deschide un nou terminal în care vom inițializa LocalTunnel
lt --port 3000 --subdomain meleag-dulce


