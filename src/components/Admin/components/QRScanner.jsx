import React, { Component } from 'react'
import QrReader from 'react-qr-scanner'
import styled from 'styled-components'
import TimeConfirmation from './TimeConfirmation'
import { useState } from 'react'

class QRScanner extends Component {
  constructor(props){
    super(props)
    this.state = {
      delay: 100,
      result: null,
    }

    this.handleScan = this.handleScan.bind(this)
  }


  handleScan(data){
    if(data == null) return;
    console.log(data);
    this.setState({
      result: data,
    })
  }
  handleError(err){
    console.error(err)
  }
  render(){
    const previewStyle = {
      height: 240,
      width: 320,
    }

    return(
      <Container>
        {!this.state.result && <QrReader
          delay={this.state.delay}
          style={previewStyle}
          onError={this.handleError}
          onScan={this.handleScan}
          />}
        {this.state.result && <TimeConfirmation uid={this.state.result.text.split("-")[0]} tid={this.state.result.text.split("-")[1]}></TimeConfirmation>}
        </Container>
    )
  }
}

export default QRScanner;

const Container = styled.div``;