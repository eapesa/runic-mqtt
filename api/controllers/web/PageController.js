module.exports = {
  home: function(req, res) {
    return res.view('homepage.ejs');
  },
  main: function (req, res) {
    return res.view('main.ejs');
  }
}