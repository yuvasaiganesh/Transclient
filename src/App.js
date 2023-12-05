import { Component } from "react";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

const defaultTableList=[{
  id:"empty",
  title:"empty",
  price:"empty",
  descriptions:"empty",
  category:"empty",
  soldItem:"empty",
  dateofsale:"empty",
  images:""
 },
 {
  id:"empty",
  title:"empty",
  price:"empty",
  descriptions:"empty",
  category:"empty",
  soldItem:"empty",
  dateofsale:"empty",
  images:""
 }]

class App extends Component {
  state = {
    month: "3",
    search: "",
    page: 1,
    tableList: [],
    salesList: "",
    soldList: "",
    notSoldList: "",
    barList: [],
  };

  changeMonth = (event) => {
    event.preventDefault();
    this.setState({ month: event.target.value }, () => {
      this.getDetails();
      this.getSales();
      this.getBar();
    });
  };
  changeSearch = (event) => {
    this.setState({ search: event.target.value }, this.getDetails);
  };

  componentDidMount() {
    this.getDetails();
    this.getSales();
    this.getBar();
  }

  getSales = async () => {
    const { month } = this.state;

    const url = `https://newtransapp.onrender.com/transactions/sales/?month=${month}`;

    const options = {
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "https://newtransapp.onrender.com/",
      },
    };

    const data = await axios.get(url, options);
    this.setState({
      notSoldList: data.data.totalNotSold.total_not_sold_items,
      soldList: data.data.totalSold.total_sold_items,
      saleList: data.data.totalSales.total_price,
    });
    console.log(data.data.totalSales.total_price);
    console.log(data.data.totalSold.total_sold_items);
    console.log(data.data.totalNotSold.total_not_sold_items);
  };

  getBar = async () => {
    const { month } = this.state;

    const url = `https://newtransapp.onrender.com/transactions/barChart/?month=${month}`;

    const options = {
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "https://newtransapp.onrender.com/",
      },
    };

    const data = await axios.get(url, options);
    this.setState({
      barList: data.data.barChartData,
    });
    console.log(data.data.barChartData);
  };

  getDetails = async () => {
    const { month, search, page } = this.state;

    const url = `https://newtransapp.onrender.com/transactions/?name=${search}&month=${month}&pages=${page}`;

    const options = {
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "https://newtransapp.onrender.com/",
      },
    };

    const data = await axios.get(url, options);
    console.log(data.data.allTransaction);
    this.setState({ tableList: data.data.allTransaction });
  };

  previousPage = () => {
    const { page } = this.state;
    if (page === 1) {
      this.setState({ page: 1 }, this.getDetails);
    } else {
      this.setState({ page: page - 1 }, this.getDetails);
    }
  };

  nextPage = () => {
    const { page } = this.state;
    if (page === 3) {
      this.setState({ page: 3 }, this.getDetails);
    } else {
      this.setState({ page: page + 1 }, this.getDetails);
    }
  };

  render() {
    const {
      month,
      tableList,
      saleList,
      soldList,
      notSoldList,
      barList,
      page,
    } = this.state;

    let monthName;
    switch (month) {
      case "1":
        monthName = "January";
        break;
      case "2":
        monthName = "February";
        break;
      case "3":
        monthName = "March";
        break;
      case "4":
        monthName = "April";
        break;
      case "5":
        monthName = "May";
        break;
      case "6":
        monthName = "June";
        break;
      case "7":
        monthName = "July";
        break;
      case "8":
        monthName = "August";
        break;
      case "9":
        monthName = "September";
        break;
      case "10":
        monthName = "October";
        break;
      case "11":
        monthName = "November";
        break;
      default:
        monthName = "December";
        break;
    }
    let totallist=tableList

    if (tableList.length===0){
      totallist=defaultTableList
    }
    return (
      <div className="App">
        <div className="firstSection">
          <div className="header">
            <input
              type="search"
              onChange={this.changeSearch}
              placeholder="search transaction"
            />
            <CiSearch onClick={this.clickSearch} />
          </div>

          <select
            className="monthSection"
            onChange={this.changeMonth}
            value={month}
          >
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">Jun</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>

        <div className="tableSection">
          <table>
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Price</th>
              <th>Description</th>
              <th>Category</th>
              <th>Sold</th>
              <th>DateOfSale</th>
              <th>Image</th>
            </tr>
            
            {totallist.map((each, key) => {
              let soldItem="Not_Sold";

              if (each.sold===1){
                soldItem="Sold"
              }
              return(
              <tr key={key}>
                <td>{each.id}</td>
                <td>{each.title}</td>
                <td>{each.price}</td>
                <td className="para">{each.descriptions}</td>
                <td>{each.category}</td>
                <td>{soldItem}</td>
                <td>{each.dateofsale}</td>
                <td>{<img  className="itemImage" src={each.images} alt="itemimage"/>}</td>
              </tr>
            )})}
          </table>
          <div className="buttonSection">
            <p className="page">Page : 0{page}</p>
            <button className="pagesButton" onClick={this.previousPage}>Previous page</button>
            <button className="pagesButton" onClick={this.nextPage}>Next page</button>
          </div>
        </div>

        <div className="statsSection">
          <h1 className="statsHead">Statistics - {monthName}</h1>
          <ul className="ulSection">
            <li className="liSection">
              <p>Total sale</p>
              <p>{saleList}</p>
            </li>
            <li className="liSection">
              <p>Total sold items</p>
              <p>{soldList}</p>
            </li>
            <li className="liSection">
              <p>Total not sold items</p>
              <p>{notSoldList}</p>
            </li>
          </ul>
        </div>
        <div className="barChart">
          <ResponsiveContainer  width="70%" height={250}>
            <BarChart
              data={barList}
              margin={{
                top: 5,
              }}
            >
              <XAxis
                dataKey="price_range"
                tick={{
                  stroke: "#ffffff",
                  strokeWidth: 1,
                }}
              />
              <YAxis
                tick={{
                  stroke: "#ffffff",
                  strokeWidth: 1,
                }}
              />
              <Legend
                wrapperStyle={{
                  padding: 10,
                }}
              />

              <Bar
                dataKey="total_items"
                name="No.of.Items"
                fill="wheat"
                barSize="1%"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}

export default App;


