var path = require('path')
var webpack = require('webpack')
var slugify = require('transliteration').slugify
var striptags = require('./strip-tags');

var markdown = require('markdown-it')({
  html: true,
  breaks: true,
  preprocess: function(MarkdownIt, source) {
    MarkdownIt.renderer.rules.table_open = function() {
      return '<table class="table">';
    };
    MarkdownIt.renderer.rules.fence = wrap(MarkdownIt.renderer.rules.fence);
    return source;
  }
})

var wrap = function(render) {
  return function() {
    return render.apply(this, arguments)
      .replace('<code class="', '<code class="hljs ')
      .replace('<code>', '<code class="hljs">');
  };
}

function convert(str) {
  str = str.replace(/(&#x)(\w{4});/gi, function($0) {
    return String.fromCharCode(parseInt(encodeURIComponent($0).replace(/(%26%23x)(\w{4})(%3B)/g, '$2'), 16));
  });
  return str;
}


markdown.use(
    require('markdown-it-anchor'),{
    level: 2,
    slugify: slugify,
    permalink: true,
    permalinkBefore: true
  }).use(require('markdown-it-container'),'demo', {
    validate: function(params) {
      return params.trim().match(/^demo\s*(.*)$/);
    },

    render: function(tokens, idx) {
      var m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
      if (tokens[idx].nesting === 1) {
        var description = (m && m.length > 1) ? m[1] : '';
        var content = tokens[idx + 1].content;
        var html = convert(striptags.strip(content, ['script', 'style'])).replace(/(<[^>]*)=""(?=.*>)/g, '$1');
        var script = striptags.fetch(content, 'script');
        var style = striptags.fetch(content, 'style');
        var jsfiddle = { html: html, script: script, style: style };
        var descriptionHTML = description
          ? markdown.render(description)
          : '';

        jsfiddle = markdown.utils.escapeHtml(JSON.stringify(jsfiddle));

        return `<demo-block class="demo-box" :jsfiddle="${jsfiddle}">
                  <div class="source" slot="source">${html}</div>
                  ${descriptionHTML}
                  <div class="highlight" slot="highlight">`;
      }
      return '</div></demo-block>\n';
    }
  })


module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.md/,
        loader: 'vue-markdown-loader',
        options: markdown
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
