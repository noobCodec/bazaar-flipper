import React from 'react';
import {SortAscIcon, SortDescIcon} from '@primer/octicons-react'


var nameMap = new Map();
nameMap.set('ENCHANTED_CARROT_STICK', 'Enchanted Carrot on a Stick');
nameMap.set('HUGE_MUSHROOM_1', 'Brown Mushroom Block');
nameMap.set('HUGE_MUSHROOM_2', 'Red Mushroom Block');
nameMap.set('ENCHANTED_HUGE_MUSHROOM_1', 'Enchanted Brown Mushroom Block');
nameMap.set('ENCHANTED_HUGE_MUSHROOM_2', 'Enchanted Red Mushroom Block');
nameMap.set('SULPHUR', 'Gunpowder');
nameMap.set('RABBIT', 'Raw Rabbit');
nameMap.set('ENCHANTED_RABBIT', 'Enchanted Raw Rabbit');
nameMap.set('RAW_FISH:1', 'Raw Salmon');
nameMap.set('RAW_FISH:2', 'Clownfish');
nameMap.set('RAW_FISH:3', 'Pufferfish');
nameMap.set('INK_SACK:3', 'Cocoa Beans');
nameMap.set('INK_SACK:4', 'Lapis Lazuli');
nameMap.set('LOG', 'Oak Log');
nameMap.set('LOG:1', 'Spruce Log');
nameMap.set('LOG:2', 'Birch Log');
nameMap.set('LOG_2:1', 'Dark Oak Log');
nameMap.set('LOG_2', 'Acacia Log');
nameMap.set('LOG:3', 'Jungle Log');
nameMap.set('AOTE_STONE', 'Warped Stone')

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
        10000
      );
    }

    componentWillUnmount() 
    {
      clearInterval(this.timerID);
    }

    humanizeStrings(str)
    {
      if(nameMap.has(str))
      {
        return nameMap.get(str);
      }
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
      console.log(e.target);
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
    checkSort(e)
    {
      return this.state.sort_type === e
    }
    changeRenderState(e)
    {
      this.setState({
        render_mode : parseInt(e.target.value),
        inflictor: e.target.dataset.raw,
        filter_type: ""
      })
    }
    render()
    {
      if(this.state.render_mode===0)
        return (
            <div>
              <h2 className="text-center table-dark bg-dark "> Shrapnel Trade</h2>
                <div className="input-group mb-3">
                <div className="input-group-prepend ms-1">
                  <span className="input-group-text" id="7">Search</span>
                </div>
                <input type="text" className="form-group" onChange={this.setSearchType}/>
                
                </div>
                <table className="table table-bordered table-hover table-secondary border-secondary table-sm">
                  <thead className="table-dark">
                    <tr name={9}>
                      <th scope="col" id={1} role='button' onClick={this.setSortType}>Name {this.state.sort_type===1 ? <SortAscIcon size={16} className="pe-none"/> : <SortDescIcon size={16} className="pe-none" />}</th>
                      <th scope="col" id= {9} role='button' onClick={this.setSortType}>Buy Price {this.state.sort_type===9 ? <SortAscIcon size={16} className="pe-none"/> : <SortDescIcon size={16} className="pe-none" />}</th>
                      <th scope="col" id= {7} role='button' onClick={this.setSortType}>Sell Price {this.state.sort_type===7 ? <SortAscIcon size={16} className="pe-none"/> : <SortDescIcon size={16} className="pe-none" />}</th>
                      <th scope="col" id= {11} role='button' onClick={this.setSortType}>Buy Volume {this.state.sort_type===11 ? <SortAscIcon size={16} className="pe-none"/> : <SortDescIcon size={16} className="pe-none" />}</th>
                      <th scope="col" id= {13} role='button' onClick={this.setSortType}>Sell Volume {this.state.sort_type===13 ? <SortAscIcon size={16} className="pe-none"/> : <SortDescIcon size={16} className="pe-none" />}</th>
                      <th scope="col" id= {15} role='button' onClick={this.setSortType}>Sales Backorder (days) {this.state.sort_type===15 ? <SortAscIcon size={16} className="pe-none"/> : <SortDescIcon size={16} className="pe-none" />}</th>
                      <th scope="col" id={5} role='button' onClick={this.setSortType}>Profit {this.state.sort_type===5 ? <SortAscIcon size={16} className="pe-none"/> : <SortDescIcon size={16} className="pe-none" />}</th>
                      <th scope="col" id={3} role='button' onClick={this.setSortType}>Percent {this.state.sort_type===3 ? <SortAscIcon size={16} className="pe-none"/> : <SortDescIcon size={16} className="pe-none" />}</th>
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
              <h2 className="text-center table-dark bg-dark "> Shrapnel Trade</h2>
              <BazaarCard name={this.state.inflictor} handler={this.changeRenderState} data={this.state.raw_data} />
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
  generateBuyData()
  {
    var item = this.props.data.products[this.props.name];
    var final_items = []
    item.buy_summary.forEach((thing) => {
      final_items.push(
      <tr>
        <td>{parseInt(thing.amount).toLocaleString("en-US")}</td>
        <td>{parseFloat(thing.pricePerUnit).toLocaleString("en-US")}</td>
        <td>{parseFloat(thing.orders).toLocaleString("en-US")}</td>
      </tr>
      )
    });
    return final_items;
  }
  humanizeStrings(str)
  {
    if(nameMap.has(str))
      {
        return nameMap.get(str);
      }
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
  generateSellData()
  {
    var item = this.props.data.products[this.props.name];
    var final_items = []
    item.sell_summary.forEach((thing) => {
      final_items.push(
      <tr>
        <td>{parseInt(thing.amount).toLocaleString("en-US")}</td>
        <td>{parseFloat(thing.pricePerUnit).toLocaleString("en-US")}</td>
        <td>{parseFloat(thing.orders).toLocaleString("en-US")}</td>
      </tr>
      )
    });
    return final_items;
  }
  render()
  {
    return (
      <div class="container-fluid">
        <h1>{this.humanizeStrings(this.props.name)}</h1>
        <div class="row">
        <div class="col-sm">
        <table className="table table-bordered table-hover table-secondary border-secondary table-sm">
          <thead className="table-dark">
            <tr>
              <th colspan="3" className="text-center"> Buy Summary</th>
            </tr>
            <tr>
              <th scope="col">Amount</th>
              <th scope="col">Price Per Unit</th>
              <th scope="col">Orders</th>
            </tr>
          </thead>
          <tbody>
            {this.generateBuyData()}
          </tbody>
        </table>
        </div>
        <div class="col-sm">
        <table className="table table-bordered table-hover table-secondary border-secondary table-sm">
          <thead className="table-dark">
            <tr>
              <th colspan="3" className="text-center"> Sell Summary</th>
            </tr>
            <tr>
              <th scope="col">Amount</th>
              <th scope="col">Price Per Unit</th>
              <th scope="col">Orders</th>
            </tr>
          </thead>
          <tbody>
            {this.generateSellData()}
          </tbody>
        </table>
        </div>
        </div>
        <div className="d-grid gap-2">
          <button type="button" className="btn btn-danger" onClick={this.props.handler} value={0}>Back To Home</button>
        </div>
      </div>
    )
  }
  
}
export default Clock;