import React, {Component} from 'react';

class Button extends Component {
    render() {
        return(
            <p className="col-auto">
               <button className={`btn-primary ${this.props.className || ''}`} 
onClick={()=>this.props.handleSolve(this.props.children)}>
                    {this.props.children}
               </button>
            </p>
        )
    }
}

export default Button