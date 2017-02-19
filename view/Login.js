/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { setAuth } from '../modules/auth';
import type { NavigationScreenProp } from 'react-navigation';
import Icon from 'react-native-vector-icons/EvilIcons';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  navigation: NavigationScreenProp
}

type InputProps = {
  onChange: (value: string) => any;
  value: string
}

class EmailInput extends Component<void, InputProps, void> {
  focus() {
    this.refs['input'].focus();
  }

  render() {
    const props = this.props;
    return (
      <View
        style={styles.textInputContainer}
      >
        <Icon name="envelope" size={40} style={styles.userIcon} color={'rgba(0,0,0,0.3)'}/>
        <TextInput
          {...props}
          ref="input"
          editable={true}
          autoFocus={true}
          style={styles.textInput}
          autoCapitalize={'none'}
          autoCorrect={false}
          keyboardType={'email-address'}
          placeholder={'Email'}
          onChangeText={props.onChange}
          value={props.value}
        />
      </View>
    );
  }
}

class PasswordInput extends Component<void, InputProps, void> {
  focus() {
    this.refs['input'].focus();
  }

  render() {
    const props = this.props;
    return (
      <View
        style={styles.textInputContainer}
      >
        <Icon name="lock" size={40} style={styles.userIcon} color={'rgba(0,0,0,0.3)'}/>
        <TextInput
          {...props}
          ref="input"
          editable={true}
          maxLength={15}
          style={styles.textInput}
          placeholder={'Password'}
          autoCapitalize={'none'}
          enablesReturnKeyAutomatically={true}
          onChangeText={props.onChange}
          value={props.value}
        />
      </View>
    );
  }
}

class Login extends React.Component {
  state = {
    username: '',
    password: '',
    error: ''
  };

  attemptLogin(username, password) {
    return fetch('https://my.ovoenergy.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',
        'Origin': 'https://my.ovoenergy.com'
      },
      body: JSON.stringify({
        username,
        password
      })
    })
      .then(res => res.json().then(body => ({ body, status: res.status })))
      .then(response => {
        if (response.status !== 200) {
          throw new Error(response.body.message);
        }
        return response.body;
      })
      .then((authResponse) => this.props.dispatch(setAuth({ username, password, authResponse })))
      .then(() => this.props.navigation.goBack())
      .catch(err => {
        this.setState({ error: err.message, password: '' });
      });
  }

  render() {
    const { username, password, error } = this.state;
    return (
      <LinearGradient style={styles.outerContainer} colors={['#94E8AD', '#015717']}>
        <Text style={styles.pageHeader}>LOG IN</Text>
        <View style={styles.form}>
          <Text style={styles.errorText}>{error}</Text>
          <EmailInput
            ref="email"
            {...this.props}
            editable={true}
            maxLength={40}
            style={styles.textInput}
            onChange={username => this.setState({ username, error: '' })}
            value={username}
            onSubmitEditing={() => {
              this.refs['password'] && this.refs['password'].focus()
            }}
          />
          <PasswordInput
            ref="password"
            {...this.props}
            editable={true}
            maxLength={40}
            secureTextEntry={true}
            style={styles.textInput}
            onChange={password => this.setState({ password, error: '' })}
            value={password}
            returnKeyType={'done'}
            onSubmitEditing={() => this.attemptLogin(username, password)}
          />
          <TouchableHighlight style={[styles.textInputContainer, styles.buttonContainer]} activeOpacity={0.5}
                              underlayColor="white" onPress={() => this.attemptLogin(username, password)}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableHighlight>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    paddingTop: 30
  },
  listContainer: {
    flex: 1,
    paddingTop: 100
  },
  errorText: {
    height: 36,
    color: 'red',
    marginLeft: 25,
    marginRight: 25,
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
  },
  form: {
    flex: 1,
    flexDirection: 'column'
  },
  textInputContainer: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    height: 50,
    borderRadius: 27,
    marginLeft: 25,
    marginRight: 25,
    paddingRight: 25,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingLeft: 25
  },
  buttonText: {
    lineHeight: 50,
    width: 100,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
  },
  textInput: {
    height: 50,
    flex: 1,
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
  },
  userIcon: {
    marginLeft: 9,
    marginTop: 9,
    width: 45
  },
  pageHeader: {
    fontFamily: 'Montserrat-Bold',
    alignSelf: 'center',
    color: 'white',
    marginTop: 70,
    marginBottom: 40,
    fontSize: 24,
    textShadowColor: 'darkgreen',
    textShadowOffset: {
      width: 1,
      height: 1
    },
    textShadowRadius: 3
  }
});

export default connect(state => ({
  nav: state.nav,
}))(Login);
