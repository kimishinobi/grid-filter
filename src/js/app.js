import React from 'react'
import ReactDOM from 'react-dom'

class FilterOption extends React.Component {
  constructor (props) {
    super(props)
    this.optionClick = this.optionClick.bind(this)
  }
  optionClick (event) {
    this.props.filterClick(event, this.props.filter)
  }
  render () {
    return (
      <option
        value={this.props.filter}
        className={"filter-option" + (this.props.selected ? " selected" : "")}
        onClick={this.optionClick}>
        {this.props.filter}
      </option>
    )
  }
}

class FilterSelect extends React.Component {
  constructor (props) {
    super(props)
    this.selectClick = this.selectClick.bind(this)
    this.state = {
      open: false
    }
  }

  selectClick (event) {
    event.preventDefault()
    this.setState({
      open: !this.state.open
    })
  }

  render () {
    return (
      <div className="filter-select-wrap"  onClick={this.selectClick}>
        <select multiple
          id="filter-select"
          className={"filter-select" + (this.state.open ? " open" : "")}>
          {Object.entries(this.props.filters)
            .map(([filter, selected]) => {
              return (
                <FilterOption key={filter} filter={filter} selected={selected} filterClick={this.props.filterClick} />
              )
            })}
        </select>
        <div className={"arrow" + (this.state.open ? "" : " down")}></div>
      </div>
    )
  }
}

class Card extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      side: "front",
      flipped: false
    }
    this.cardFlip = this.cardFlip.bind(this)
  }
  cardFlip (event) {
    console.log('cardFlip')
    this.setState({
      flipped: !this.state.flipped
    })
  }
  render () {
    return (
      <div className="card col-sm-6 col-md-4 col-lg-4 col-xl-4">
        <div className="content">
          <div className="front">
            {(this.props.card.featured == 1) &&
              <div className="ribbon"><span>FEATURED</span></div>
            }
            <img src={this.props.card.image} alt={this.props.card.title} title={this.props.card.title} />
            <div className="copy">
              <h2>{this.props.card.title}</h2>
              <p>{this.props.card.description.substring(0, 300) + '...'}</p>
            </div>
          </div>
          <div className="back">
            {this.props.card.tags.map((tag) => {
              return (
                <div className="tag" key={tag}>{tag}</div>
              )
            })}
          </div>
          <a className="cta" href="#"><span className="cta-copy">LEARN MORE</span> <span className="caret">&rsaquo;</span></a>
        </div>
      </div>
    )
  }
}

function Grid (props) {
  return (
    <div className="grid">
      {props.cards.filter((card) => {
        let show = true
        Object.entries(props.filters).forEach(([filter, selected]) => {
          if (selected) {
            if (card.tags.indexOf(filter) == -1) {
              show = false
            }
          }
        })
        return show
      })
      .map((card) => {
        return (
          <Card key={card.id} card={card} />
        )
      })}
    </div>
  )
}

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      cards: [],
      filters: {}
    }
    this.filterClick = this.filterClick.bind(this)
  }
  componentDidMount () {
    fetch('https://s3-us-west-1.amazonaws.com/hero-engineering-public/interview/fe-code-challenge.json?=callback')
      .then((response) => {
        return response.json()
      })   
      .then((json) => {
        // initialize cards
        this.setState({
          cards: (json && json.cards) ? json.cards : []
        })
        // initialize filters
        this.state.cards.map((card) => {
          card.tags && card.tags.map((tag) => {
            const filters = this.state.filters
            if (!filters.hasOwnProperty(tag)) {
              filters[tag] = false
              this.setState({
                filters: filters
              })
            }
          })
        })
      })
  }

  filterClick (event, filter) {
    let filters = this.state.filters
    filters[filter] = !filters[filter]
    this.setState({
      filters: filters
    })
  }

  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-12">
            <FilterSelect filters={this.state.filters} filterClick={this.filterClick} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-md-12">
            <Grid filters={this.state.filters} cards={this.state.cards} />
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
