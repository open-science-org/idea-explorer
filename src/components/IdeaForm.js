import React from 'react';
import PropTypes from 'prop-types';
import IPFS from 'ipfs';

const stringToUse = 'hello world from webpacked IPFS';
 
class IdeaForm extends React.Component {
  constructor (props, context) {
    super(props);
    this.ipfsNode = new IPFS({ repo: String(Math.random() + Date.now()) });
    this.state = {
      id: null,
      version: null,
      protocol_version: null,
      added_file_hash: null,
      added_file_contents: null
    };
  }

  create () {
    // Create the IPFS node instance

    this.ipfsNode.once('ready', () => {
      console.log('IPFS node is ready');
      this.ops();
    })
  }

  ops () {
    this.ipfsNode.id((err, res) => {
      if (err) {
        throw err
      }
      this.setState({
        id: res.id,
        version: res.agentVersion,
        protocol_version: res.protocolVersion
      });
    })

    this.ipfsNode.files.add([Buffer.from(stringToUse)], (err, filesAdded) => {
      if (err) { throw err }

      const hash = filesAdded[0].hash;
      this.setState({ added_file_hash: hash });

      this.ipfsNode.files.cat(hash, (err, data) => {
        if (err) { throw err }
        this.setState({ added_file_contents: data.toString() });
      })
    })
  }

  componentDidMount () {
    this.create();
  }

 
  /**
   * web3Context = {
   *   accounts: {Array<string>} - All accounts
   *   selectedAccount: {string} - Default ETH account address (coinbase)
   *   network: {string} - One of 'MAINNET', 'ROPSTEN', or 'UNKNOWN'
   *   networkId: {string} - The network ID (e.g. '1' for main net)
   * }
   */
 
  render () {
    return (
      <div style={{ textAlign: 'center' }}>
        <h1>Using your ethereum account: {this.context.web3.selectedAccount}</h1>
        <h1>Everything is working!</h1>
        <p>Your ID is <strong>{this.state.id}</strong></p>
        <p>Your IPFS version is <strong>{this.state.version}</strong></p>
        <p>Your IPFS protocol version is <strong>{this.state.protocol_version}</strong></p>
        <hr />
        <div>
          Added a file! <br />
          {this.state.added_file_hash}
        </div>
        <br />
        <br />
        <p>
          Contents of this file: <br />
          {this.state.added_file_contents}
        </p>
      </div>
    )
  }
}
 
IdeaForm.contextTypes = {
  web3: PropTypes.object
};
 
export default IdeaForm;