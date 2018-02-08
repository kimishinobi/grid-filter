import React from 'react'
import ReactDOM from 'react-dom'
import MediaQuery from 'react-responsive'

class FilterOption extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick (event) {
    this.props.filterClick(event, this.props.filter)
  }
  render () {
    return (
      <MediaQuery query="(min-width: 0px)">
        <MediaQuery query="(min-width: 576px)">
          <div className={"filter-option" + (this.props.selected ? " selected" : "")}
            onClick={this.handleClick}>
            {this.props.filter}
          </div>
        </MediaQuery>
        <MediaQuery query="(max-width: 575px)">
          <div className={"filter-option" + (this.props.selected ? " selected" : "")}
            onClick={this.handleClick}>
            {this.props.filter}
          </div>
        </MediaQuery>
      </MediaQuery>
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
    console.log('selectClick')
    event.preventDefault()
    this.setState({
      open: !this.state.open
    })
    document.getElementById("filter-select").scrollTop = 0
  }

  render () {
    const filters = Object.entries(this.props.filters)
      .map(([filter, selected]) => {
        return (
          <FilterOption key={filter} filter={filter} selected={selected} filterClick={this.props.filterClick} />
        )
      })
    return (
      <MediaQuery query="(min-width: 0px)">
        <MediaQuery query="(min-width: 576px)">
          <div className="filter-select">
            {filters}
          </div>
        </MediaQuery>
        <MediaQuery query="(max-width: 576px)">
          <div id="filter-select" className={"filter-select" + (this.state.open ? " open" : "")}>
            {filters}
            <div className="arrow" onClick={this.selectClick}>
              <svg viewBox="0 0 20 20" width="20" height="20">
                <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z">
                </path>
              </svg>
            </div>
          </div>
        </MediaQuery>
      </MediaQuery>
    )
  }
}

function Grid (props) {
  // console.log('props.filters', props.filters)
  return (
    <div className="grid">
      {props.cards.filter((card) => {
        let show = true
        Object.entries(props.filters).forEach(([filter, selected]) => {
          // console.log('filter', filter)
          // console.log('selected', selected)
          if (selected) {
            if (card.tags.indexOf(filter) == -1) {
              // console.log('show false')
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
          cards: (json.cards) ? json.cards : []
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

  // componentWillUnmount () {
  // }

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
