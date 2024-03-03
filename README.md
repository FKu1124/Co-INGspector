# Backend

In the "backend" folder

Since some of these files are quite large it is recommended to download them selectively.

Download the base IBM datasets ("Hi-XXX-Trans.csv") from [Kaggle](https://www.kaggle.com/datasets/ealtman2019/ibm-transactions-for-anti-money-laundering-aml?resource=download) and copy them into the "data" folder.
Download the custom datasets and predictors from [Sciebo](https://uni-muenster.sciebo.de/s/DvLWeVBJYu2rowL) and place them in the respective folder.
Download the predictors from [Google Drive](https://drive.google.com/drive/folders/1z7zCYBtyZsMvFoQkPMbHMH8I5UqFVBut?usp=sharing) and place them in the respective folder (uploading these predictors to Sciebo failed multiple times)

Run the following command (once) to install the conda environment from file
```
conda env create -f cdr_env.yml
``````

Run the following command to activate the environment
```
conda activate cdr
``````


Run the following command to activate the jupyter server
```
jupyter notebook
``````

Run the following command to run the backend server
```
python server.py
```


# Frontend

In the "ing-dashboard" folder


Run the following command (once) to install all dependencies
```
npm i
``````

Run the following command to start the development server
```
npm run dev
``````