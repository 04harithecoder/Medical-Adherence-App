"""
Wraps DRF's default exception handling so unhandled errors (validation
errors, 401s, 404s, etc.) still come back in MEDAI's standard envelope
instead of DRF's default {"detail": "..."} shape.
"""
from rest_framework.views import exception_handler


def medai_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return response

    detail = response.data
    if isinstance(detail, dict) and 'detail' in detail and len(detail) == 1:
        message = str(detail['detail'])
    else:
        message = detail

    response.data = {
        'success': False,
        'error': {
            'code': exc.__class__.__name__.upper(),
            'message': message,
        },
    }
    return response
