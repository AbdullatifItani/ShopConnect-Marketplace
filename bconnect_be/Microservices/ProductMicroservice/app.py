from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from .db_config import DB_CONFIG

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DB_CONFIG
CORS(app)
db = SQLAlchemy(app)
ma = Marshmallow(app)

from .services import get_products_service, get_product_by_id_service, create_product_service


@app.route('/products', methods=['GET'])
def get_products():
    return get_products_service.get_products(db)

@app.route('/products/create', methods=['POST'])
def create_product():
    return create_product_service.create_product(db)

@app.route('/products/<product_id>', methods=['GET'])
def get_product_by_id(product_id):
    return get_product_by_id_service.get_product_by_id(product_id)




if __name__ == "__main__":
    app.run(port=8084)