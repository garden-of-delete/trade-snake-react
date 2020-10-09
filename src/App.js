import * as React from 'react';
import './App.css';
import { Grid } from '@material-ui/core';
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
          Test text
        </Grid>
        <Grid item>
          {current_trades && current_trades.map((t) => {
            return(
              <Trade 
                key={t.order_id}
                duration={t.duration}
                price={t.price}
                location_id={t.location_id}
                min_volume={t.min_volume}/>
            )
          })}
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
