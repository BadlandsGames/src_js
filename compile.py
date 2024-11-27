import os
import sys

file_name = sys.argv[1]

os.system("npm coffee " + file_name + " -o " + file_name.split(".")[0] + ".js")