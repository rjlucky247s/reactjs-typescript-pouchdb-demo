import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import axios from "axios";
import Dbfunctions from "../Pouchdb";

interface IState {
  customers: any[];
}

export default class Home extends React.Component<RouteComponentProps, IState> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = { customers: [] };
  }
  public componentDidMount(): void {
    // Dbfunctions.Get((data: any) => {
    //   this.setState({ customers: data });
    //   console.log("Test");
    //   console.log(data);
    // });
    // axios.get(`http://localhost:5000/customers`).then((data) => {
    //   this.setState({ customers: data.data });
    // });

    Dbfunctions.GetAllCustomers().then((data) => {
      let customers: any[] = [];
      console.log(data.rows);
      data.rows.forEach((row: any) => {
        customers.push(row.doc);
      });
      this.setState({ customers: customers });
    });
  }
  public deleteCustomer(id: any) {
    console.log("id>>" + id);
    console.log(this.state.customers);
    Dbfunctions.Delete(id).then(() => {
      const index = this.state.customers.findIndex(
        (customer) => (customer._id = id)
      );
      this.state.customers.splice(index, 1);
      this.props.history.push("/");
    });
    // axios.delete(`http://localhost:5000/customers/${id}`).then((data) => {
    //   const index = this.state.customers.findIndex(
    //     (customer) => customer.id === id
    //   );
    //   this.state.customers.splice(index, 1);
    //   this.props.history.push("/");
    // });
  }
  public render() {
    const customers = this.state.customers;
    return (
      <div>
        {customers.length === 0 && (
          <div className="text-center">
            <h2>No customer found at the moment</h2>
          </div>
        )}
        <div className="container">
          <div className="row">
            <table className="table table-bordered">
              <thead className="thead-light">
                <tr>
                  <th scope="col">Firstname</th>
                  <th scope="col">Lastname</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Address</th>
                  <th scope="col">Description</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers &&
                  customers.map((customer) => (
                    <tr key={customer._id}>
                      <td>{customer.first_name}</td>
                      <td>{customer.last_name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      <td>{customer.address}</td>
                      <td>{customer.description}</td>
                      <td>
                        <div className="d-flex justify-content-between align-items-center">
                          <div
                            className="btn-group"
                            style={{ marginBottom: "20px" }}
                          >
                            <Link
                              to={`edit/${customer._id}`}
                              className="btn btn-sm btn-outline-secondary"
                            >
                              Edit Customer{" "}
                            </Link>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => this.deleteCustomer(customer._id)}
                            >
                              Delete Customer
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
