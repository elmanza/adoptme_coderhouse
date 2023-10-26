import mongoose from "mongoose";
import supertest from "supertest";
import User from '../src/dao/Users.dao.js';
import Pets from '../src/dao/Pets.dao.js';
import chai from "chai";
import { createHash, passwordValidation } from "../src/utils/index.js";
import UserDTO from '../src/dto/User.dto.js';
const connection = mongoose.connect(`mongodb+srv://manzano:R91GSBjvF0nTEncU@empowermentlab.gj9tokx.mongodb.net/clase52225?retryWrites=true&w=majority`)
const serverApp = supertest("http://localhost:8080");

const expect = chai.expect; 

// describe("Testing de usuarios", () => {
//   let userID = "";
//   before("Empezando los test", function () {
//     this.userDao = new User();
//     console.log("BEFORE");
//   });
//   beforeEach("-", function () {
//     console.log("-----------------------------");
//   });

//   it("Recibir un array de obtener todos los usuario por medio del metodo GET", async function(){
//     const result = await this.userDao.get();
//     expect(Array.isArray(result)).to.be.ok;
//   });

//   // it("Creacion del usaurio", async function(){
//   //   let mockUser = {
//   //     first_name: "ejemploFinal",
//   //     last_name: "Coder",
//   //     email: "ejemploFinal5@gmail.com",
//   //     password: "secret123"
//   //   }
//   //   const result = await this.userDao.save(mockUser);
//   //   console.log("[SAVE] ~~ result --> ", result);
//   //   expect(result).to.have.property("first_name", "ejemploFinal");
//   //   userID = result._id;
//   // });

//   // it("actualizar el usuario", async function(){
//   //     let mockUser = {
//   //       first_name: "Ejemplo Actualizado",
//   //     }
//   //     // console.log({userID: userID.toString()});
//   //     const result = await this.userDao.update(userID, mockUser);
//   //     // console.log("[UPDATE] ~~ result --> ", result);
//   //     expect(result).to.have.own.property('email');
//   //   });

//   it("Hasheo efectivo de la constraseña",async function(){
//     const pass = "secret123";
//     const passHash = await createHash(pass);
//     expect(pass).to.not.equal(passHash);
//   });

//   it("Validacion de las contraseñas",async function(){
//     const pass = "secret123";
//     const passHash = await createHash(pass);
//     const isMatch = await passwordValidation({password: passHash},pass);
//     expect(isMatch).to.equal(true);
//   });

//   it("Validacion contraseña alterada",async function(){
//     const pass = "secret123";
//     const passHash = await createHash(pass);
//     const passAltered = passHash.replace("a", "b")
//     const isMatch = await passwordValidation({password: passAltered},pass);
//     expect(isMatch).to.not.equal(true);
//   });

//   it("Unificacion del nombre en el DTO de Users",async function(){
//     let user = {
//       first_name: "Carlos",
//       last_name: "Gómex",
//       role: "Premium",
//       email: "carlos@gmail.com"
//     }
//     let userTransfromed = UserDTO.getUserTokenFrom(user);
//     expect(userTransfromed).to.have.property("name");
//     expect(userTransfromed).to.not.have.property("first_name");
//     expect(userTransfromed).to.not.have.property("last_name");
//   });

//   after("Finalizando todos los test", function(){
//     console.log("AFTER");
//   })
// })

describe("Probando con superTest", ()=>{
  describe("Test de mascotas", ()=>{
    let idMascotaCreada = null;
    before("Empezando los test", function () {
      this.petDao = new Pets();
    });
    // it("Obtener la propiedad de Adopted como false por defecto", async function(){
    //   let petMock = {
    //     name: "Kira",
    //     specie: "Perrita",
    //     birthDate: "11-11-2016"
    //   }
    //   const {statusCode, ok, _body} = await serverApp.post('/api/pets').send(petMock);
    //   idMascotaCreada = _body.payload._id;
    //   expect(_body.payload.adopted).to.equal(false);
    // })

    it("Error tipo 400", async function(){
      let petMock = {
        // name: "Kira",
        specie: "Perrita",
        birthDate: "11-11-2016"
      }
      const {statusCode, ok, _body} = await serverApp.post('/api/pets').send(petMock);
      expect(statusCode).to.equal(400);
    })

    it("Validacion cuerpo de la respuesta de obtener todas las mascotas", async function(){
      const {statusCode, ok, _body} = await serverApp.get('/api/pets')
      expect(_body).to.have.property("status");
      expect(_body).to.have.property("payload");
      expect(_body.payload).to.be.an("array");
    })

    // it("Actualizar mascota", async function(){
    //   let updatePet = {
    //     name: "Mila"
    //   }
    //   const {statusCode, ok, _body} = await serverApp.put(`/api/pets/${idMascotaCreada}`).send(updatePet);
    //   expect(_body.message).to.equal("pet updated");
    // })

    // it("Obtener mascota actualizada", async function(){
    //   const {statusCode, ok, _body} = await serverApp.get(`/api/pets`);
    //   let petUpdated = _body.payload.find(pet => pet._id.toString() === idMascotaCreada);
    //   expect(petUpdated.name).to.equal("Mila");
    // })

    // it("Eliminar mascota", async function(){
    //   // pet deleted
    //   let idPet = "6525d4c17f38177843b0d30d";
    //   const {statusCode, ok, _body} = await serverApp.delete(`/api/pets/${idPet}`);
    //   expect(_body.message).to.equal("pet deleted");
    // });

    // it("Verificar si la mascota fué eliminiada de la base de datos!", async function(){
    //   // pet deleted
    //   let idPet = "6525d4c17f38177843b0d30d";
    //   const petDeleted = await this.petDao.getById(idPet);
    //   expect(petDeleted).to.be.null;
    // });
    let cookieObj = {
      nameCookie: "",
      valueCookie: ""
    }
    it("Devuelve una cookie con el nombre de unprotectedcookie", async function(){
      let loginMock = {
         email: "ar.manzano.94@gmail.com", password: "secret123"
      }
      const result = await serverApp.get(`/api/sessions/unprotectedLogin`).send(loginMock);
      const cookies = result.headers['set-cookie'][0];
      cookieObj.nameCookie = cookies.split("=")[0];
      cookieObj.valueCookie = cookies.split("=")[1];
      expect(cookieObj.nameCookie).to.equal("unprotectedCookie");
    })

    it("Que la cookie nos retorne la info del usuario", async function(){
      const result = await serverApp.get(`/api/sessions/unprotectedCurrent`)
        .set("Cookie", [`${cookieObj.nameCookie}=${cookieObj.valueCookie}`]);
        expect(result._body.payload).to.have.property("_id");
        expect(result._body.payload).to.have.property("name");
        expect(result._body.payload).to.have.property("email");
        expect(result.ok).to.equal(true);
    })
  })
})