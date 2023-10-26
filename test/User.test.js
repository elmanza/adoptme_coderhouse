import mongoose from "mongoose";
import User from '../src/dao/Users.dao.js';
import Assert from "assert";
const connection = mongoose.connect(`mongodb+srv://manzano:R91GSBjvF0nTEncU@empowermentlab.gj9tokx.mongodb.net/clase52225?retryWrites=true&w=majority`)

const assert = Assert.strict;

describe("Testing de usuarios", () => {
  before("Empezando los test", function () {
    this.userDao = new User();
    console.log("BEFORE");
  });

  it("Recibir un array de obtener todos los usuario por medio del metodo GET", async function(){
    const result = await this.userDao.get();
    assert.strictEqual(Array.isArray(result), true);
  });

  it("Creacion del usaurio", async function(){
    let mockUser = {
      first_name: "Sandra2",
      last_name: "Soto",
      email: "sandrasoto2@gmail.com",
      password: "secret123"
    }
    const result = await this.userDao.save(mockUser);
    // assert.ok(result._id);
    assert.deepStrictEqual(result.pets, []);
  });

  after("Finalizando todos los test", function(){
    console.log("AFTER");
  })
})