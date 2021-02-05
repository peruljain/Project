import databases
import sqlalchemy

class Datamodel :
    
    def __init__(self):
        DATABASE_URL = "sqlite:///./test.db"
        metadata = sqlalchemy.MetaData()
        self.memes = sqlalchemy.Table(
            "memes",
            metadata,
            sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
            sqlalchemy.Column("name", sqlalchemy.String),
            sqlalchemy.Column("caption", sqlalchemy.String),
            sqlalchemy.Column("url", sqlalchemy.String)
        )

        engine = sqlalchemy.create_engine(
            DATABASE_URL, connect_args={"check_same_thread": False}
        )
        metadata.create_all(engine)
        self.database = databases.Database(DATABASE_URL)

    def get_database(self):
        return self.database

    def get_table(self):
        return self.memes
