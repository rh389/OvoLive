/* @flow */

import { AsyncStorage } from 'react-native';
import { attemptLogin } from './auth';

type Thunk = (dispatch: (action: any) => Promise<any>, getState: () => any) => Promise<any>;

export type InstantReading = {
  consumption: {
    demand: number;
    timestamp: number;
    consumptionPrice: {
      amount: number;
      currency: string;
    };
    unitPrice: {
      amount: number;
      currency: string;
    };
    utilityType: 'ELECTRICITY';
    measurementUnit: 'KW';
  }
}

export type Account = {
  id: string,
  globalId: string,
  userId: string,
  supplierAccountId: string,
  accountHolder: string,
  customer: {
    title: string,
    firstName: string,
    lastName: string
  },
  contacts: {
    email: string,
    homeNumber: string,
    mobileNumber: string,
    workNumber: string
  },
  balance: {
    amount: string,
    currency: string
  },
  directDebit: {
    directDebitType: string,
    frequency: string,
    paymentDay: number,
    payment: {
      amount: string,
      currency: string
    },
    nextPaymentDate: string
  },
  bankDetails: {
    accountHolder: string,
    accountNumber: string,
    sortCode: string
  },
  homeAddress: {
    line1: string,
    line2: string,
    line3: string,
    line4: string,
    town: string,
    county: string,
    postcode: string
  },
  billingAddress: {
    line1: string,
    line2: string,
    line3: string,
    line4: string,
    town: string,
    county: string,
    postcode: string
  },
  consumers: {
    id: string,
    mpan: string,
    installationId: string,
    utilityType: string,
    utilitySubType: string,
    status: string,
    supplierStartDate: string,
    salesDate: string,
    coolOffPeriodEndDate: string,
    serviceOrders: [],
    meters: {
      id: string,
      accountId: string,
      supplierConsumerId: string,
      supplierMeterId: string,
      itemType: string,
      unitOfMeasure: string,
      estimatedAnnualConsumption: string,
      meterSerialNumber: string,
      numDigits: number,
      isSmart: boolean,
      installationDate: string
    }[]
  }[],
  contracts: {
    id: string,
    consumerId: string,
    startDate: string,
    expiryDate: string,
    upForRenewal: boolean,
    upForRefix: boolean,
    utility: string,
    standingCharge: {
      amount: {
        amount: string,
        currency: string
      },
      unit: string,
      item: string
    },
    rates: {
      _1: {
        amount: {
          amount: string,
          currency: string
        },
        unit: string,
        item: string
      },
      _2: {
        amount: {
          amount: string,
          currency: string
        },
        unit: string,
        item: string
      }
    },
    plan: {
      name: string,
      planType: string,
      isFixed: boolean,
      isOnlineDiscount: boolean
    },
    isRenewed: boolean,
    status: string
  }[],
  credentials: {
    username: string,
    password: string,
    securityQuestion: string,
    securityAnswer: string,
    customerId: string
  },
  discountStatus: string,
  supplyStartDate: string,
  statementFrequency: {
    period: string,
    day: number
  },
  accountType: string,
  customerType: string
}

type LivePoint = {
  startTime: number,
  instantPower: number,
  tariff: number,
  price: number
}

type MissingLivePoint = {
  startTime: number,
  dataError: 'Not found'
}

export type LiveData = {
  power: (LivePoint | MissingLivePoint)[]
};


//https://live.ovoenergy.com/api/live/meters/1012797888852/instant-power?from=2017-02-19T00%3A00%3A00.000Z&to=2017-02-20T00%3A00%3A00.000Z


export function fetchToday(retryAuth: boolean = true): Thunk {
  return (dispatch, getState) => {
    const account: Account = getState().instant.account;
    if (!account) {
      return Promise.reject(new Error('Account data not available'));
    }
    const now = new Date();
    const tomorrow = (new Date(Date.now() + 24 * 3600 * 1000));

    const formatDate = (d: Date) => `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + (d.getDate())).slice(-2)}`;

    const mpan = account.consumers[0].mpan;
    return fetch('https://live.ovoenergy.com/api/live/meters/' + mpan + `/instant-power?from=${formatDate(now)}T00%3A00%3A00.000Z&to=${formatDate(tomorrow)}T00%3A00%3A00.000Z`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': getState().auth.token
      }
    })
      .then(res => {
        if (res.status === 401) {
          if (retryAuth) {
            const { username, password } = getState().auth;
            return dispatch(attemptLogin(username, password)).then(fetchInstant(false));
          }
        }
        return res.json().then(body => ({ body, status: res.status }));
      })
      .then(res => {
        if (res.status === 200) {
          return res.body;
        }
        throw new Error('Error ' + res.status);
      })
      .then(body =>
        dispatch({
          type: 'TODAY',
          payload: body
        })
      )
  }
}


export function fetchInstant(retryAuth: boolean = true): Thunk {
  return (dispatch, getState) => {
    const account: Account = getState().instant.account;
    if (!account) {
      return Promise.reject(new Error('Account data not available'));
    }
    const mpan = account.consumers[0].mpan;
    return fetch('https://live.ovoenergy.com/api/live/meters/' + mpan + '/consumptions/instant', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': getState().auth.token
      }
    })
      .then(res => {
        if (res.status === 401) {
          if (retryAuth) {
            const { username, password } = getState().auth;
            return dispatch(attemptLogin(username, password)).then(fetchInstant(false));
          }
        }
        return res.json().then(body => ({ body, status: res.status }));
      })
      .then(res => {
        if (res.status === 200) {
          return res.body;
        }
        throw new Error('Error ' + res.status);
      })
      .then(body =>
        dispatch({
          type: 'INSTANT_READING',
          payload: body
        })
      )
  }
}

export function fetchAccount(retryAuth: boolean = true): Thunk {
  return (dispatch, getState) => {

    return fetch('https://paym.ovoenergy.com/api/paym/accounts', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': getState().auth.token
      }
    })
      .then(res => {
        if (res.status === 401) {
          if (retryAuth) {
            const { username, password } = getState().auth;
            return dispatch(attemptLogin(username, password)).then(fetchAccount(false));
          }
        }
        return res.json().then(body => ({ body, status: res.status }));
      })
      .then(res => {
        if (res.status === 200) {
          return res.body;
        }
        throw new Error('Error ' + res.status);
      })
      .then(body =>
        dispatch({
          type: 'ACCOUNT',
          payload: body[0]
        })
      )
  }
}

export default function (state = { lastReading: null, account: null }, action) {
  if (action.type === 'INSTANT_READING') {
    const payload: InstantReading = action.payload;

    let newToday = state.today.power;
    if (state.today && state.today.power) {

      const idx = newToday.findIndex((point) =>
        (point.startTime >= payload.consumption.timestamp)
      );
      if (idx !== -1) {
        newToday = [...newToday.slice(0, idx), {
          startTime: payload.consumption.timestamp,
          instantPower: payload.consumption.demand,
        }, ...newToday.slice(idx)]
      }
    }

    return {
      ...state,
      today: {
        power: newToday
      },
      lastReading: action.payload
    }
  }
  if (action.type === 'ACCOUNT') {
    return {
      ...state,
      account: action.payload
    }
  }
  if (action.type === 'TODAY') {
    return {
      ...state,
      today: action.payload
    }
  }
  return state;
};
