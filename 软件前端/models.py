from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class AdminUser(db.Model):
    __tablename__ = 'admin_users'

    AdminID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Username = db.Column(db.String(50), nullable=False, unique=True)
    Password = db.Column(db.String(100), nullable=False)
    CreateDate = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'adminID': self.AdminID,
            'username': self.Username,
            'createDate': self.CreateDate.isoformat() if self.CreateDate else None
        }

class User(db.Model):
    __tablename__ = 'users'

    UserID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Username = db.Column(db.String(50), nullable=False, unique=True)
    Password = db.Column(db.String(100), nullable=False)
    Email = db.Column(db.String(100))
    Phone = db.Column(db.String(20))
    CreateDate = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'userID': self.UserID,
            'username': self.Username,
            'email': self.Email,
            'phone': self.Phone,
            'createDate': self.CreateDate.isoformat() if self.CreateDate else None
        }

class Resource(db.Model):
    __tablename__ = 'resources'

    ResourceID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Code = db.Column(db.String(20), nullable=False)
    Name = db.Column(db.String(200), nullable=False)
    Director = db.Column(db.String(100), nullable=False)
    Studio = db.Column(db.String(100))
    Category = db.Column(db.String(50))
    Status = db.Column(db.Enum('可观看', '已借出'), default='可观看')
    CreateDate = db.Column(db.DateTime, default=datetime.utcnow)

    # 关系
    borrow_records = db.relationship('BorrowRecord', backref='resource', lazy=True)

    def to_dict(self):
        return {
            'resourceID': self.ResourceID,
            'code': self.Code,
            'title': self.Name,
            'director': self.Director,
            'producer': self.Studio,
            'category': self.Category,
            'status': self.Status,
            'createDate': self.CreateDate.isoformat() if self.CreateDate else None
        }

class BorrowRecord(db.Model):
    __tablename__ = 'borrow_records'

    RecordID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ResourceID = db.Column(db.Integer, db.ForeignKey('resources.ResourceID'), nullable=False)
    BorrowerName = db.Column(db.String(50), nullable=False)
    BorrowDate = db.Column(db.Date, nullable=False)
    ReturnDate = db.Column(db.Date)
    Notes = db.Column(db.String(200))

    def to_dict(self):
        return {
            'recordID': self.RecordID,
            'resourceID': self.ResourceID,
            'borrowerName': self.BorrowerName,
            'borrowDate': self.BorrowDate.isoformat() if self.BorrowDate else None,
            'returnDate': self.ReturnDate.isoformat() if self.ReturnDate else None,
            'notes': self.Notes,
            'resource': self.resource.to_dict() if self.resource else None
        }