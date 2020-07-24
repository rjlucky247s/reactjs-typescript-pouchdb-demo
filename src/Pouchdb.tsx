import PouchDB from "pouchdb";

export interface ICustomer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
}

const localDB = new PouchDB("Customers");
const remoteDB = new PouchDB("http://localhost:5984/customers-db");

// Configure to sync the changes to remote Database
localDB
  .sync(remoteDB, {
    live: true,
  })
  .on("change", function (change) {
    console.log(change);
  })
  .on("error", function (err) {
    console.log(err);
  });

class Dbfunctions {
  //  Create a customer
  public static CreateCustomer(data: any): Promise<any> {
    var promise = localDB.put(data).catch(function (err) {
      console.log(err);
    });
    return promise;
  }

  // Update customer details
  public static UpdateCustomer(id: any, data: any): Promise<any> {
    var promise = localDB.get(id).then((doc: any) => {
      doc.first_name = data.first_name;
      doc.last_name = data.last_name;
      doc.email = data.email;
      doc.phone = data.phone;
      doc.address = data.address;
      doc.description = data.description;
      localDB.put(doc);
    });
    return promise;
  }

  // Get a customer by giving an ID
  public static GetCustomer(id: any): Promise<any> {
    var promise = localDB.get(id).catch((err) => {
      console.log(err);
    });
    return promise;
  }

  //Get all the customers from Database
  public static GetAllCustomers(): Promise<any> {
    var promise = localDB.allDocs({ include_docs: true }).catch(function (err) {
      console.log(err);
    });
    return promise;
  }

  //Delete customer from Database
  public static Delete(id: any): Promise<any> {
    var promise = localDB
      .get(id)
      .then((doc) => localDB.remove(doc))
      .catch((err) => console.log(err));
    return promise;
  }
}

export default Dbfunctions;
