class Response:
    @staticmethod
    def make(status=True, msg='',data=[]):
        return {'status':status, 'msg':msg, 'data':data}

    # def status(status=True, port='', routes=[]):
    #     return {'status':status, 'port':port, 'routes':routes}