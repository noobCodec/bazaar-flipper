import React from 'react';
import ReactDOM from 'react-dom/client';

class Clock extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {date: null,sort_type:0,items:null,filter_type:"",render_mode:0,inflictor:"",raw_data:null};
        this.setSortType = this.setSortType.bind(this);
        this.sortedRender = this.sortedRender.bind(this);
        this.setSearchType = this.setSearchType.bind(this);
        this.changeRenderState = this.changeRenderState.bind(this);
    }
    componentDidMount() 
    {
      this.tick();
      this.timerID = setInterval(
        () => this.tick(),
        1000
      );
    }

    componentWillUnmount() 
    {
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

    async tick() 
    {
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
          listitems.push(<BazaarItem handler={this.changeRenderState} data={item.productId} name={this.humanizeStrings(item.productId)} profit={profit.toFixed(2)} percent={profit/buy_price.pricePerUnit} buy_price={buy_price.pricePerUnit} sell_price={sell_price.pricePerUnit} sell_volume={item.sellVolume} buy_volume={item.buyVolume} back_order={item.sellVolume/(item.buyMovingWeek/7)}/>)
      });
      }
      this.setState({
        raw_data : response
      });  
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
          sort_array.sort((a,b) => a.props.name < b.props.name ? -1 : 1);
          break;
        case 2:
          sort_array.sort((a,b) => a.props.name < b.props.name ? -1 : 1).reverse();
          break;
        case 3:
          sort_array.sort((a,b) => parseFloat(a.props.percent) < parseFloat(b.props.percent) ? -1 : 1);
          break;
        case 4:
          sort_array.sort((a,b) => parseFloat(a.props.percent) < parseFloat(b.props.percent) ? -1 : 1).reverse();
          break;
        case 5:
          sort_array.sort((a,b) => parseFloat(a.props.profit) < parseFloat(b.props.profit) ? -1 : 1);
          break;
        case 6:
          sort_array.sort((a,b) => parseFloat(a.props.profit) < parseFloat(b.props.profit) ? -1 : 1).reverse();
          break;
        case 7:
          sort_array.sort((a,b) => parseFloat(a.props.buy_price) < parseFloat(b.props.buy_price) ? -1 : 1);
          break;
        case 8:
          sort_array.sort((a,b) => parseFloat(a.props.buy_price) < parseFloat(b.props.buy_price) ? -1 : 1).reverse();
          break;
        case 9:
          sort_array.sort((a,b) => parseFloat(a.props.sell_price) < parseFloat(b.props.sell_price) ? -1 : 1);
          break;
        case 10:
          sort_array.sort((a,b) => parseFloat(a.props.sell_price) < parseFloat(b.props.sell_price) ? -1 : 1).reverse();
          break;
        case 11:
          sort_array.sort((a,b) => parseFloat(a.props.buy_volume) < parseFloat(b.props.buy_volume) ? -1 : 1);
          break;
        case 12:
          sort_array.sort((a,b) => parseFloat(a.props.buy_volume) < parseFloat(b.props.buy_volume) ? -1 : 1).reverse();
          break;
        case 13:
          sort_array.sort((a,b) => parseFloat(a.props.sell_volume) < parseFloat(b.props.sell_volume) ? -1 : 1);
          break;
        case 14:
          sort_array.sort((a,b) => parseFloat(a.props.sell_volume) < parseFloat(b.props.sell_volume) ? -1 : 1).reverse();
          break;
        case 15:
          sort_array.sort((a,b) => parseFloat(a.props.back_order) < parseFloat(b.props.back_order) ? -1 : 1);
          break;
        case 16:
          sort_array.sort((a,b) => parseFloat(a.props.back_order) < parseFloat(b.props.back_order) ? -1 : 1).reverse();
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
    changeRenderState(e)
    {
      console.log(e.target.dataset.raw);
      this.setState({
        render_mode : parseInt(e.target.value),
        inflictor: e.target.dataset.raw
      })
    }
    render()
    {
      if(this.state.render_mode==0)
        return (
            <div>
              <p className="text-center table-dark bg-dark "> Shrapnel Trade</p>
                <div className="input-group mb-3">
                <input type="text" className="form-control" onChange={this.setSearchType}/>
                <div className="input-group-prepend">
                  <span className="input-group-text" id="7">Search</span>
                </div>
              </div>
                <table className="table table-bordered table-hover table-secondary border-secondary">
                  <thead className="table-dark">
                    <tr name={9}>
                      <th scope="col" id={1} role='button' onClick={this.setSortType}>Name</th>
                      <th scope="col" id= {9} role='button' onClick={this.setSortType}>Buy Price</th>
                      <th scope="col" id= {7} role='button' onClick={this.setSortType}>Sell Price</th>
                      <th scope="col" id= {11} role='button' onClick={this.setSortType}>Buy Volume</th>
                      <th scope="col" id= {13} role='button' onClick={this.setSortType}>Sell Volume</th>
                      <th scope="col" id= {15} role='button' onClick={this.setSortType}>Sales Backorder (days)</th>
                      <th scope="col" id={5} role='button' onClick={this.setSortType}>Profit</th>
                      <th scope="col" id={3} role='button' onClick={this.setSortType}>Percent</th>
                    </tr>
                  </thead>
                <tbody>
                  {this.sortedRender()}
                </tbody>
                </table>
              
            </div>
          );
      else
          return (
            <div>
              <p className="text-center table-dark bg-dark "> Shrapnel Trade</p>
              <BazaarCard name={this.state.inflictor} handler={this.changeRenderState} data={this.state.raw_data} />
            </div>
          )
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
        <td onClick={this.props.handler} value={1} role='button' data-raw={this.props.data}>{this.props.name}</td>
        <td>{parseFloat(this.props.sell_price).toLocaleString("en-US")}</td>
        <td>{parseFloat(this.props.buy_price).toLocaleString("en-US")}</td>
        <td>{parseFloat(this.props.buy_volume).toLocaleString("en-US")}</td>
        <td>{parseFloat(this.props.sell_volume).toLocaleString("en-US")}</td>
        <td>{parseFloat(this.props.back_order).toLocaleString("en-US")}</td>
        <td>{parseFloat(this.props.profit).toLocaleString("en-US")}</td>
        <td>{parseFloat(this.props.percent).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})}</td>
      </tr>
    )
  }
}

class BazaarCard extends React.Component
{
  constructor(props)
  {
    super(props);
    this.generateData();
  }
  generateData()
  {
    var name = this.props.name;
    var item = this.props.data.products[this.props.name];
    var final_items = []
    item.buy_summary.forEach((thing) => {
      final_items.push(
      <tr>
        <td>{parseInt(thing.amount)}</td>
        <td>{parseInt(thing.pricePerUnit)}</td>
        <td>{parseInt(thing.orders)}</td>
      </tr>
      )
    });
    return final_items;
  }
  render()
  {
    return (
      <div>
        <table className="table table-bordered table-hover table-secondary border-secondary">
          <thead className="table-dark">
            <tr>
              <th scope="col">Amount</th>
              <th scope="col">Price Per Unit</th>
              <th scope="col">Orders</th>
            </tr>
          </thead>
          <tbody>
            {this.generateData()}
          </tbody>
        </table>
        <button onClick={this.props.handler} value={0}>Click Me</button>
      </div>
    )
  }
}
export default Clock;