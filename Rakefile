task :default => [:minify]

desc "Minify"
task :minify do
  begin
    require "rubygems"
    require "uglifier"
  rescue LoadError => e
    if verbose
      puts "\nYou'll need the 'uglifier' gem for minification. Just run:\n\n"
      puts "  $ gem install uglifier"
      puts "\nand you should be all set.\n\n"
      exit
    end
    return false
  end
  puts "Minifying jquery.chained.js with UglifyJS..."
  File.open("jquery.chained.min.js", "w"){|f| f.puts Uglifier.new.compile(File.read("jquery.chained.js"))}
  puts "Minifying jquery.chained.remote.js with UglifyJS..."
  File.open("jquery.chained.remote.min.js", "w"){|f| f.puts Uglifier.new.compile(File.read("jquery.chained.remote.js"))}

end