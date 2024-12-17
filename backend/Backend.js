import express from 'express';
import cors from 'cors';
import ds_conn, {LOGS, SUBSCRIPTIONS, USER_PAYMENTS} from './ds/conn';
import router from './routes';
import bodyParser from 'body-parser';
import {USERS} from './ds/conn';

const app = express();
app.use(cors());
app.use(express.static(__dirname + '/assets'));
app.use(bodyParser.urlencoded({extended: true, limit: '100mb'}));
app.use(bodyParser.json({limit: '100mb'}));

router(app);

app.get('/', (req, res) => res.send('<div><h1>Hi, its Battron.</h1></div>'));

let pricing = {
  500: 'monthly',
  5000: 'annually',
};
app.post('/flutterwave_hook', (req, res) => {
  // if()

  LOGS.write(req.body);

  let {data, event} = req.body;
  if (!event) {
    data = req.body;
  }
  let {customer, amount, paymentPlan: payment_plan, status} = data;
  if (status === 'successful') {
    let type = pricing[amount];

    let user = USERS.readone({email: customer.email});
    if (!user) return res.end();

    let resp = SUBSCRIPTIONS.write({
      amount,
      status,
      email: customer.email,
      user: user._id,
      type,
      payment_plan,
    });
    USER_PAYMENTS.write({user: user._id, payment: resp._id, type});
    USERS.update(user._id, {subscription: resp._id});
  }
  res.end();
});

app.post('/cancel_subscription', (req, res) => {
  let {user} = req.body;

  USERS.update(user, {subscription: null});

  res.end();
});

app.listen(1451, () => {
  ds_conn();

  console.log('Battron Backend started on :1451');
});
