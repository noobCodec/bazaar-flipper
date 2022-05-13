import React from 'react';
import ReactDOM from 'react-dom/client';

class Clock extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {date: null,sort_type:0,items:null,filter_type:""};
        this.setSortType = this.setSortType.bind(this);
        this.sortedRender = this.sortedRender.bind(this);
        this.setSearchType = this.setSearchType.bind(this);
    }
    componentDidMount() {
      this.tick();
      this.timerID = setInterval(
        () => this.tick(),
        1000
      );
    }

    componentWillUnmount() {
      clearInterval(this.timerID);
    }

    humanizeStrings(str)
    {
      str = str.toLowerCase();
      str = str[0].toUpperCase() + str.slice(1);
      str = str.replaceAll("_"," ");
      var idx = 0;
      while(((idx = str.indexOf(" ",idx+1))!== -1))
      {
        str = str.slice(0,idx+1) + str[idx+1].toUpperCase() + str.slice(idx+2,str.length);
      }
      return str;
    }

    async tick() {
      var response = await fetch('https://api.hypixel.net/skyblock/bazaar').then(response => response.json());
      var listitems = [];
      if(response)
      {
        Object.entries(response.products).forEach(([key,value]) => {
        var item = value.quick_status;
        var sell_price = value.sell_summary[0];
        var buy_price = value.buy_summary[0];
        var profit = 0;
        if(sell_price && buy_price)
        {
          profit = (buy_price.pricePerUnit - sell_price.pricePerUnit);
        }
        if(profit > 0)
          listitems.push(<BazaarItem name={this.humanizeStrings(item.productId)} profit={profit.toFixed(2)} percent={profit/buy_price.pricePerUnit} />)
      });
      }  
      this.setState({
        date : listitems
      });
    }
    sortedRender()
    {
      var sort_type = parseInt(this.state.sort_type);
      var sort_array = this.state.date;
      if(sort_array == null) return;
      switch(sort_type)
      {
        case 1:
          sort_array.sort((a,b) => a.props.name < b.props.name ? -1 : 1)
          break;
        case 2:
          sort_array.sort((a,b) => a.props.name < b.props.name ? -1 : 1).reverse()
          break;
        case 3:
          sort_array.sort((a,b) => parseFloat(a.props.percent) < parseFloat(b.props.percent) ? -1 : 1)
          break;
        case 4:
          sort_array.sort((a,b) => parseFloat(a.props.percent) < parseFloat(b.props.percent) ? -1 : 1).reverse()
          break;
        case 5:
          sort_array.sort((a,b) => parseFloat(a.props.profit) < parseFloat(b.props.profit) ? -1 : 1)
          break;
        case 6:
          sort_array.sort((a,b) => parseFloat(a.props.profit) < parseFloat(b.props.profit) ? -1 : 1).reverse()
          break;
        default:
          break;
      }
      if(this.state.filter_type !== "")
      {
          return sort_array.filter((thing) => thing.props.name.toLowerCase().includes(this.state.filter_type.toLowerCase()))
      }
      return sort_array;
    }
    setSortType(e)
    {
      this.setState(prevState => ({
        sort_type: (parseInt(prevState.sort_type) === parseInt(e.target.id)) ? parseInt(e.target.id) + 1 : parseInt(e.target.id)
      }));
    }
    setSearchType(e)
    {
      this.setState({
        filter_type : e.target.value
      });
    }
    render()
    {
      // console.log(this.state.date.products);
        return (
            <div>
              <p className="text-center table-dark bg-dark "> Shrapnel Trade</p>
              <div className="input-group mb-3">
              <input type="text" class="form-control" onChange={this.setSearchType}/>
              <div className="input-group-prepend">
                <span className="input-group-text" id="7">Search</span>
              </div>
            </div>
              <table className="table table-bordered table-hover table-secondary border-secondary">
                <thead className="table-dark">
                  <tr name={9}>
                    <th scope="col" id={1} onClick={this.setSortType}>Name</th>
                    <th scope="col" id={5} onClick={this.setSortType}>Profit</th>
                    <th scope="col" id={3} onClick={this.setSortType}>Percent</th>
                  </tr>
                </thead>
              <tbody>
                {this.sortedRender()}
              </tbody>
              </table>
            </div>
          );
    }
}

class BazaarItem extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {data: null};
  }
  render()
  {
    return (
      <tr>
        <td>{this.props.name}</td>
        <td>{parseFloat(this.props.profit).toLocaleString("en-US")}</td>
        <td>{parseFloat(this.props.percent).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})}</td>
      </tr>
    )
  }

}
export default Clock;