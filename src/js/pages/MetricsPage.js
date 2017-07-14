import React ,{PropTypes} from "react";
import MyAppointmentItem from "../components/MyAppointmentItem";
import 'aws-sdk/dist/aws-sdk';
import ThemeManager from 'material-ui/styles/themeManager';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import BarDisplay from './BarDisplay';
import SelectInput from "../components/SelectInput";

export default class MetricsPage extends React.Component {
  
  constructor(props)
  {
    super(props);

    this.state={selectedValue:"Machine A ",
    	machineNames:[" Machine A ","Machine B","Machine C"]
	             };

    this.onChange = this.onChange.bind(this);
   
  }


 onChange(event,evtKey)
 {
    console.log(event.target.value);
    this.setState({selectedValue:event.target.value});
 }

    static childContextTypes = {
    	muiTheme: PropTypes.object
    }
    getChildContext() {
        return {
            muiTheme: getMuiTheme()
        }
    }

  render()
  {
  	console.log(" In the Rendering page for Metrics page ");
  	return( <div class="container ">

       <SelectInput
        name="Machine Name "
        label=""
        value={this.state.selectedValue}
        defaultOption="Select Dept"
        options={this.state.machineNames}
        onChange={this.onChange}
        />
  	 <BarDisplay/></div>)
  }

}