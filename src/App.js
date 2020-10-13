import * as React from 'react';
import './App.css';
import { Button, Grid, List, ListItem } from '@material-ui/core';
//import test_trades_json from './static/test_trades.json';
import axios from 'axios';
import { orderBy } from 'lodash';

function App() {
  const [selected_trade, set_selected_trade] = React.useState()
  const [current_trades, set_current_trades] = React.useState()
  React.useEffect(() => {
    pull_data()
  }, [])

  async function pull_data() {
    const result = await axios.get("http://ec2-54-215-48-242.us-west-1.compute.amazonaws.com:5000/api/trades")
    const sorted_result = orderBy(result.data,(t) => t.ppj, ["desc"])
    set_current_trades(sorted_result)
  }

  const select_trade=(trade_id) => () => {
    set_selected_trade(trade_id)
  }

  function accept_selected_trade() {
    axios.post("http://ec2-54-215-48-242.us-west-1.compute.amazonaws.com:5000/api/accept-trade", {selected_trade: selected_trade.id})
  }

  return (
    <div className="App">
      <Grid container>
        <Grid item xs={4}>
          <form>
            <label>
              Location: <input type="text" name="name" />
            </label>
          </form>
          <form>
            <label>
              Capacity (m3): <input type="text" name="name" />
            </label>
          </form>
          <Button variant="contained" style={{margin: '8px', backgroundColor: 'lightblue'}}>
            Filter Trades
          </Button>
        {selected_trade && (
          <Trade 
          trade = {selected_trade}/>
        )}
        </Grid>
        <Grid item>
          <List style={{maxHeight: '480px', overflow: "auto"}}>
          {current_trades && current_trades.map((t) => {
            return(
              <ListItem key={t.id} style={{border: '1px solid black'}} onClick={select_trade(t)}>
                <Trade 
                trade = {t}
                is_selected={selected_trade?.id === t.id}/>
              </ListItem>
            )
          })}
          </List>
          <Button onClick={accept_selected_trade} variant="contained" style={{margin: '8px', backgroundColor: 'lightgreen'}}>
            Accept
          </Button>
          <Button variant="contained" style={{margin: '8px', backgroundColor: 'red'}}>
            Abandon
          </Button>
          <Button onClick={pull_data} variant="contained" style={{margin: '8px', backgroundColor: 'lightblue'}}>
            Refresh Trades
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

function Trade({trade, is_selected}) {
  return (
    <Grid container style={{backgroundColor: is_selected?'blueviolet': undefined}}>
      <Grid item xs={6}>
        {`${trade.source} -> ${trade.destination}`}
      </Grid>
      <Grid item xs={6}>
        {trade.total_value} isk
      </Grid>
      <Grid item xs={6}>
        {trade.item_name}
      </Grid>
      <Grid item xs={6}>
        {trade.ppj} isk/jump
      </Grid>
    </Grid>
  );
}

export default App;
