cwd=$(pwd)
cd $cwd/XmemeBackend
uvicorn main:app --port 8081