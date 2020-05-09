import React,{Component} from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity
} from 'react-native';
import {vibrate} from './utils'

function Timer ({interval, style}){
  const pad = (n) => n < 10 ? '0' + n: n

  const minutes=Math.trunc(interval/60);
  const seconds=Math.trunc((interval/60%1)*60);

  return (
    <View style={styles.timerContainer}>
      <Text style={style}>{pad(minutes)}</Text>
      <Text style={styles.timerMiddle}>:</Text>
      <Text style={style}>{pad(seconds)}</Text>
    </View>
    )
}

function RoundButton({title,color, background, onPress, disabled}){
  return (
    <TouchableOpacity 
    onPress={()=> !disabled && onPress()} 
    style = {[styles.button, { backgroundColor:background}]}  
    activeOpacity={disabled ? 1.0 : 0.7 } 
    >
      <View style={styles.buttonBorder}>
        <Text style={[styles.button.Title ,{color}]} > {title}</Text>
      </View>
      </TouchableOpacity>
  )

}
function ButtonRow({children}){
  return (
  <View style={styles.buttonsRow}>{children}</View>
  )
}
function ButtonRowAdjust({children}){
  return (
  <View style={[styles.timerContainer ,    {flexDirection: 'row'}]} >{children}</View>

  )
}
function ButtonAdjust({title,color,fontSize, background, onPress, disabled}){
  return (
    <TouchableOpacity 
    onPress={()=> onPress()} 
    style = {[styles.buttonAdjust, { backgroundColor:background}]}  
    activeOpacity={disabled ? 1.0 : 0.7 } 
    >
      <View >
        <Text style={[{color:'#FFFFFF',fontSize:30}]}  > {title}</Text>
      </View>
      </TouchableOpacity>
  )

}

export default class App extends Component {
  constructor (props){
    super(props)
    this.state={
      focusState:true,
      estado:'Focus',
      userFocusTime:1500,
      userRestTime:300,
      timer:1500,
      onStart:true,
      onPause:false,
      onResume:false,
      onSetting:true,
      reset:true,
      inputMinutes:25,
      laps:[ ]
    } 
  }
  componentWillUnmount(){
    clearInterval(this.counter)
  }
  checkTimer=()=>{
         if(this.state.timer===0){
            clearInterval(this.counter)
            vibrate()
            if (this.state.focusState) {
              this.setState ({
              focusState:false,
              timer:this.state.userRestTime,
              estado:'Descanso',
              })
              }
            else{
              this.setState ({
              focusState:true,
              estado:'Focus',
              timer:this.state.userFocusTime
              })
            }
            this.start();    
            }
               
  }
  start=()=>{
    if(this.state.reset){
    this.setState({
        reset:false,
        timer:this.state.userFocusTime,
              })
    }
    this.counter=setInterval(()=>{
      this.setState(prevState => {return { timer: prevState.timer -1,
                                            start: prevState.start +1,
                                            onStart:false,
                                            onPause:true,
                                            onSetting:false,
                                            }})
      this.checkTimer()
    },1000)
  }
  
  stop = () => {
    clearInterval(this.timer)
    this.setState({
      start: 0,
      now:0
    })
  }
  resume = () => {
    this.counter=setInterval(()=>{
      this.setState(prevState => {return { timer: prevState.timer -1,
                                          start: prevState.start +1,
                                          onStart:false,
                                          onPause:true
                                        }})
      this.checkTimer()
    },1000)
  }
  
  pause = () => {
    clearInterval(this.counter)
    this.setState({
      onPause:false
    })
  }
  reset =() => {
    clearInterval(this.counter)
    this.setState({
      userFocusTime:1500,
      userRestTime:300,
      onStart:true,
      onPause:false,
      onResume:false,
      onSetting:true,
      reset:true,
      estado:'Focus',
     
    })
  }
  addMinuteFocus = () => {
    if(this.state.userFocusTime <3540){

    this.setState(prevState => {return { userFocusTime: prevState.userFocusTime +60   
    }})
  }
  }
  restMinuteFocus = () => {
    if(this.state.userFocusTime >60){
      this.setState(prevState => {return { userFocusTime: prevState.userFocusTime -60   
    }})
   } 
  }
  addSecondFocus = () => {
    if(this.state.userFocusTime <3599){

    this.setState(prevState => {return { userFocusTime: prevState.userFocusTime +1   
    }})
  }
  }
  restSecondFocus = () => {
    if(this.state.userFocusTime >1){
      this.setState(prevState => {return { userFocusTime: prevState.userFocusTime -1   
    }})
   } 
  }
  
  addMinuteRest =() => {
  if(this.state.userRestTime <3540){
    this.setState(prevState => {return { userRestTime: prevState.userRestTime +60    
    }})
  }
  }
  restMinuteRest =() => {
    if(this.state.userRestTime >60){
      this.setState(prevState => {return { userRestTime: prevState.userRestTime -60   
      }})
    }
  }
  addSecondRest =() => {
    if(this.state.userRestTime <3599){
      this.setState(prevState => {return { userRestTime: prevState.userRestTime +1    
      }})
    }
    }
    restSecondRest =() => {
      if(this.state.userRestTime >1){
        this.setState(prevState => {return { userRestTime: prevState.userRestTime -1   
        }})
      }
    }
  render () {
    const { onSetting, userRestTime, userFocusTime,timer, onStart,onPause,onResume}=this.state
    
    return ( 
      <View style={styles.container}>
        <Text     style={[ styles.title ,{ color:'#FFFFFF' }]}>{this.state.estado}</Text>
        {!onStart &&  (
        <Timer 
        interval={timer} style={styles.timer}/>
        )}  
        {onSetting && (
          <Timer 
          interval={userFocusTime} style={styles.timer}></Timer>
        )} 
          {onSetting && (
          
          <ButtonRowAdjust style={styles.timerContainer}>
            <ButtonAdjust 
              title='+' 
              color='#FFFFFF' 
              alignSelf='center'
              onPress={this.addMinuteFocus}/>
            <ButtonAdjust 
              title='-' 
              color='#FFFFFF' 
              alignSelf='center'
              onPress={this.restMinuteFocus}
              />
            <Text style={styles.timerMiddle}/>
            <ButtonAdjust 
              title='+' 
              color='#FFFFFF' 
              alignSelf='center'
              onPress={this.addSecondFocus}/>
            <ButtonAdjust 
              title='-' 
              color='#FFFFFF' 
              alignSelf='center'
              onPress={this.restSecondFocus}
              />
            
          </ButtonRowAdjust>
          )}  
            {onSetting && (
          
          <Text style={[ styles.title ,{ alignItems: 'center',color:'#FFFFFF' }]}>Descanso</Text>
          )}  
          {onSetting && (
          <Timer 
          interval={ userRestTime} style={styles.timer}></Timer>
          )}  
          {onSetting && (
      
          <ButtonRowAdjust>
            <ButtonAdjust 
              title='+' 
              color='#FFFFFF' 
              alignSelf='center'
              onPress={this.addMinuteRest}/>
            <ButtonAdjust 
              title='- ' 
              color='#FFFFFF' 
              alignSelf='center'
              onPress={this.restMinuteRest}
              />
              
            <ButtonAdjust 
              title='+' 
              color='#FFFFFF' 
              alignSelf='center'
              onPress={this.addSecondRest}/>
            <ButtonAdjust 
              title='-' 
              color='#FFFFFF' 
              alignSelf='center'
              onPress={this.restSecondRest}/>

          </ButtonRowAdjust>
        
        
        )}
        <ButtonRow>
        
      
        {onStart &&  (
          <RoundButton 
            title='Start' 
            color='#50D167' 
            background='#1B361F'
            onPress={this.start}/>
        
        )}
        {(!onStart && !onPause) &&  (
      
          <RoundButton 
            title='Resume' 
            color='#50D167' 
            background='#1B361F'
            onPress={this.resume}/>
          
        
        )}
        {onPause && (
       
          <RoundButton 
            title='Pause' 
            color='#E33935' 
            background='#3C1715'
            onPress={this.pause}/>
       
        
        )}
        <RoundButton 
            title='Reset' 
            color='#8B8B90' 
            background='#151515'
            onPress={this.reset}/>
        </ButtonRow>
       </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    alignItems: 'center',
    paddingTop:130,
    paddingHorizontal: 20,
  },
  timer : {
    color: '#FFFFFF',
    fontSize:76,
    fontWeight:'200',
    width:110,
    // paddingLeft:0,
    justifyContent:'center',
    textAlign:'center',
    alignContent:'center',
    alignItems:'center'  
  },
  
  title : {
    color: '#FFFFFF',
    fontSize:20,
    fontWeight:'200',
    width:110,
    paddingLeft:0,
    justifyContent:'center',
    textAlign:'center',
    paddingRight:0,
  },
  timerMiddle : {
    color: '#FFFFFF',
    fontSize:76,
    fontWeight:'200',
    width:30,
    paddingLeft:0,
    justifyContent:'center',
    textAlign:'center',
    paddingRight:0,
  },
  button:{
    width:80,
    height:80,
    borderRadius: 40,
    justifyContent:'center',
    alignItems:'center'
  },
  buttonTitle:{
    fontSize:18,
  },
  buttonBorder:{
    width: 76,
    height:76,
    borderRadius: 38,
    borderWidth:2,
    justifyContent:'center',
    alignItems:'center'
  },
  buttonAdjust:{
    width:55,
    height:30,
    fontSize:76,

    // borderRadius: 38,
    // borderWidth:2,
    justifyContent:'center',
    alignItems:'center'
  },
  buttonRowAdjust : {
    color: '#FFFFFF',
    fontSize:76,
    fontWeight:'200',
    width:110,
    paddingLeft:0,
    paddingRight:0,
  },
 
  
  buttonsRow:{
    flexDirection: 'row',
    alignSelf:'stretch',
    justifyContent:'space-between',
    marginTop: 80, 
    marginBottom:30,
  },
  timerContainer:{
    flexDirection: 'row'
  }
});
