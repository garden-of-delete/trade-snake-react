import * as React from 'react';
import './App.css';
import { Button, Grid, List, ListItem } from '@material-ui/core';
//import test_trades_json from './static/test_trades.json';
import axios from 'axios';
import { orderBy } from 'lodash';

function App() {
  const [current_trades, set_current_trades] = React.useState()
  React.useEffect(() => {
    async function pull_data() {
      const result = await axios.get("https://esi.evetech.net/latest/markets/10000001/orders/")
      const sorted_result = orderBy(result.data,(t) => t.price, ["desc"])
      set_current_trades(sorted_result)
      console.log(result.data.length)
    }
    pull_data()
  }, [])
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
        </Grid>
        <Grid item>
          <List style={{maxHeight: '480px', overflow: "auto"}}>
          {current_trades && current_trades.map((t) => {
            return(
              <ListItem style={{border: '1px solid black'}}>
                <Trade 
                key={t.order_id}
                duration={t.duration}
                price={t.price}
                location_id={t.location_id}
                min_volume={t.min_volume}/>
              </ListItem>
            )
          })}
          </List>
          <Button variant="contained" style={{margin: '8px', backgroundColor: 'lightgreen'}}>
            Accept
          </Button>
          <Button variant="contained" style={{margin: '8px', backgroundColor: 'red'}}>
            Abandon
          </Button>

        </Grid>
      </Grid>
    </div>
  );
}

function Trade({duration, price ,location_id, min_volume}) {
  return (
    <Grid container>
      <Grid item xs={6}>
        {duration}
      </Grid>
      <Grid item xs={6}>
        {price}
      </Grid>
      <Grid item xs={6}>
        {location_id}
      </Grid>
      <Grid item xs={6}>
        {min_volume}
      </Grid>
    </Grid>
  );
}

export default App;
