const express = require("express")
const app = express()

const admin = require("firebase-admin")
const credentials = require("./key.json")

admin.initializeApp({
    credential: admin.credential.cert(credentials)
})

const db = admin.firestore()
const port = 3000

app.listen(port, () => {
    console.log(`Servidor Iniciado na port ${port}`)
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.post('/usuarios/create', async(request, response) =>{
    try{
        const user = {
            nome: request.body.nome,
            email: request.body.email,
            cpf: request.body.cpf
        }
        db.collection("usuarios").add(user)
        response.send("Usuario Cadastrado com Sucesso.")
    }catch(error){
        response.send(error.message)
    }
})

app.get('/usuario/listar', async(request, response) => {
    try{
        const usuariosRef = db.collection("usuarios");
        const usuarios = await usuariosRef.get();
        usuariosJson = [];
        usuarios.forEach(doc => {
            usuariosJson.push({
                id: doc.id,
                cpf: doc.data().cpf,
                email: doc.data().email,
                nome:doc.data().nome  
            });
          });
        response.send(usuariosJson);
    }catch(error){
        response.send(error.message)
    }

})

app.get('/usuario/:id', async(request, response) => {
    try{
        const usuariosRef = db.collection("usuarios");
        const usuario = await usuariosRef.doc(request.params.id).get();

        if (usuario.empty) {
            response.send("Nenhum usuario encontrado")
            return;
        } 

        response.send(usuario.data());
    }catch(error){
        response.send(error.message)
    }

})

app.get('/usuario/cpf/:id', async(request, response) => {
    try{
        const usuariosRef = db.collection("usuarios");
        const usuario = await usuariosRef.where("cpf", "==", request.params.id).get();

        if (usuario.empty) {
            response.send("Nenhum usuario encontrado")
            return;
        } 

        response.send(usuario.docs.map(doc => doc.data()));
    }catch(error){
        response.send(error.message)
    }

})

app.put('/usuarios/:id/update', async(request, response) =>{
    try{
        const usuariosRef = db.collection("usuarios");
        const usuario = await usuariosRef.doc(request.params.id).get();

        if (usuario.empty) {
            response.send("Nenhum usuario encontrado")
            return;
        }
        
        const user = {
            nome: request.body.nome,
            email: request.body.email,
            cpf: request.body.cpf
        }
        
        usuariosRef.doc(request.params.id).update(user);
        response.send("Usuario atualizado com Sucesso.")
    }catch(error){
        response.send(error.message)
    }
})

app.delete('/usuarios/:id/delete', async(request, response) =>{
    try{
        const usuariosRef = db.collection("usuarios");
        const usuario = await usuariosRef.doc(request.params.id).get();

        if (usuario.empty) {
            response.send("Nenhum usuario encontrado")
            return;
        }
        
        const res = await usuariosRef.doc(request.params.id).delete();
        response.send("Usuario deletado com Sucesso.")
    }catch(error){
        response.send(error.message)
    }
})
