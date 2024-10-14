# File Manager
RS School NodeJS 2024Q3 task#2

## Features

**Navigation & working directory**

`up` - Go upper from the current directory

`cd path_to_directory` - Go to dedicated folder from current directory (path_to_directory can be relative or absolute)

`ls` - Print in console list of all files and folders in current directory

**Basic operations with files**

`cat path_to_file` - Read file and print it's content in console

`add new_file_name` - Create empty file in current working directory

`rn path_to_file new_filename` - Rename file

`cp path_to_file path_to_new_directory` - Copy file

`mv path_to_file path_to_new_directory` - Move file

`rm path_to_file` - Delete file

**Operating system info**

`os --EOL` - Get default system End-Of-Line

`os --cpus` - Get host machine CPUs info

`os --homedir` - Get home directory

`os --username` - Get current system user name

`os --architecture` - Get CPU architecture for which Node.js binary has compiled

**Hash calculation**

`hash path_to_file` - Calculate hash for file

**Compress and decompress operations**

`compress path_to_file path_to_destination` - Compress file using Brotli algorithm (note: add '.br' extention to the file name)

`decompress path_to_file path_to_destination` - Decompress file using Brotli algorithm (note: remove the file name extention)

*P.S. Use double quotes to pass file/directory name with space*