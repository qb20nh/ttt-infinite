{ echo '---\n---'; cat $1; } > $1.new
mv $1.new $1
